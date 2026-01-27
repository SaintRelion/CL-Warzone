const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const billingService = new FirestoreService('Billing');
const paymentsService = new FirestoreService('PaymentHistory');
const usersService = new FirestoreService('User');

// All routes require authentication and admin role
router.use(protect, restrictTo('admin'));

// Helper to get month range
const getMonthRange = (month, year) => {
  const startDate = new Date(year, month, 1);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(year, month + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

// Helper to calculate collection rate
const calculateCollectionRate = (collected, billable) => {
  if (billable === 0) return 0;
  return Math.round((collected / billable) * 100);
};

// Helper to format currency
const formatCurrency = (value) => {
  return parseFloat(value || 0).toFixed(2);
};

// @route   GET /api/reports/monthly-payment-report
// @desc    Generate monthly payment report
// @access  Private/Admin
// @query   month (0-11), year
router.get('/monthly-payment-report', asyncHandler(async (req, res) => {
  const { month, year, status = 'all' } = req.query;

  if (month === undefined || year === undefined) {
    return res.status(400).json({
      error: 'Month and year are required'
    });
  }

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (monthNum < 0 || monthNum > 11 || yearNum < 2000 || yearNum > 2100) {
    return res.status(400).json({
      error: 'Invalid month or year'
    });
  }

  const { startDate, endDate } = getMonthRange(monthNum, yearNum);

  // Get all users
  const allUsers = await usersService.findAll({
    where: [['role', '==', 'client']]
  });

  // Get all billings for this month
  const monthlyBillings = await billingService.findAll({
    where: [
      ['createdAt', '>=', startDate],
      ['createdAt', '<=', endDate]
    ]
  });

  // Get all payments for this month
  const monthlyPayments = await paymentsService.findAll({
    where: [
      ['createdAt', '>=', startDate],
      ['createdAt', '<=', endDate]
    ]
  });

  // Build report items
  const reportItems = allUsers.map((user) => {
    const userBilling = monthlyBillings.find(b => b.userId === user.id);
    const userPayments = monthlyPayments.filter(p => p.userId === user.id);

    const billingAmount = userBilling ? parseFloat(userBilling.amount) : 0;
    const paidAmount = userPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    let paymentStatus = 'Not Yet Paid';
    if (paidAmount >= billingAmount && billingAmount > 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0 && paidAmount < billingAmount) {
      paymentStatus = 'Partially Paid';
    }

    // Filter by status if requested
    if (status !== 'all' && paymentStatus !== status) {
      return null;
    }

    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber || '',
      billingAmount: formatCurrency(billingAmount),
      paidAmount: formatCurrency(paidAmount),
      status: paymentStatus,
      planId: userBilling?.planId || '',
      paymentDate: userPayments.length > 0 ? userPayments[0].createdAt : '',
      paymentMethod: userPayments.length > 0 ? userPayments[0].method : '',
      transactionRef: userPayments.length > 0 ? userPayments[0].transactionRef : ''
    };
  }).filter(item => item !== null);

  // Calculate summary
  const totalBillable = reportItems.reduce((sum, item) => sum + parseFloat(item.billingAmount), 0);
  const totalCollected = reportItems.reduce((sum, item) => sum + parseFloat(item.paidAmount), 0);
  const totalPending = totalBillable - totalCollected;

  const paidCount = reportItems.filter(item => item.status === 'Paid').length;
  const partiallyPaidCount = reportItems.filter(item => item.status === 'Partially Paid').length;
  const unpaidCount = reportItems.filter(item => item.status === 'Not Yet Paid').length;

  const report = {
    month: monthNum,
    year: yearNum,
    generatedAt: new Date().toISOString(),
    totalBillable: formatCurrency(totalBillable),
    totalCollected: formatCurrency(totalCollected),
    totalPending: formatCurrency(totalPending),
    items: reportItems,
    summary: {
      totalSubscribers: reportItems.length,
      paidSubscribers: paidCount,
      partiallyPaidSubscribers: partiallyPaidCount,
      unpaidSubscribers: unpaidCount,
      collectionRate: calculateCollectionRate(totalCollected, totalBillable)
    }
  };

  // Log the activity
  await logActivity(req.user.id, 'REPORT_GENERATED', {
    reportType: 'monthly-payment-report',
    month: monthNum,
    year: yearNum
  });

  res.json({
    ok: true,
    data: report
  });
}));

// @route   GET /api/reports/monthly-payment-report/export
// @desc    Export monthly payment report as CSV
// @access  Private/Admin
router.get('/monthly-payment-report/export', asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (month === undefined || year === undefined) {
    return res.status(400).json({
      error: 'Month and year are required'
    });
  }

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  const { startDate, endDate } = getMonthRange(monthNum, yearNum);

  // Get all users
  const allUsers = await usersService.findAll({
    where: [['role', '==', 'client']]
  });

  // Get all billings for this month
  const monthlyBillings = await billingService.findAll({
    where: [
      ['createdAt', '>=', startDate],
      ['createdAt', '<=', endDate]
    ]
  });

  // Get all payments for this month
  const monthlyPayments = await paymentsService.findAll({
    where: [
      ['createdAt', '>=', startDate],
      ['createdAt', '<=', endDate]
    ]
  });

  // Build CSV content
  let csvContent = 'Name,Email,Phone,Billing Amount,Paid Amount,Status,Payment Method,Transaction Ref\n';

  allUsers.forEach((user) => {
    const userBilling = monthlyBillings.find(b => b.userId === user.id);
    const userPayments = monthlyPayments.filter(p => p.userId === user.id);

    const billingAmount = userBilling ? parseFloat(userBilling.amount) : 0;
    const paidAmount = userPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    let paymentStatus = 'Not Yet Paid';
    if (paidAmount >= billingAmount && billingAmount > 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0 && paidAmount < billingAmount) {
      paymentStatus = 'Partially Paid';
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    const paymentMethod = userPayments.length > 0 ? userPayments[0].method : '';
    const transactionRef = userPayments.length > 0 ? userPayments[0].transactionRef : '';

    csvContent += `"${fullName}","${user.emailAddress}","${user.phoneNumber || ''}","${billingAmount.toFixed(2)}","${paidAmount.toFixed(2)}","${paymentStatus}","${paymentMethod}","${transactionRef}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="payment-report-${yearNum}-${String(monthNum + 1).padStart(2, '0')}.csv"`);
  res.send(csvContent);

  // Log the activity
  await logActivity(req.user.id, 'REPORT_EXPORTED', {
    reportType: 'monthly-payment-report',
    month: monthNum,
    year: yearNum,
    format: 'csv'
  });
}));

// @route   GET /api/reports/summary
// @desc    Get reporting summary (available months, etc.)
// @access  Private/Admin
router.get('/summary', asyncHandler(async (req, res) => {
  // Get all billings to determine available months
  const allBillings = await billingService.findAll();

  const monthsSet = new Set();
  allBillings.forEach((billing) => {
    const date = new Date(billing.createdAt);
    monthsSet.add(`${date.getFullYear()}-${date.getMonth()}`);
  });

  const availableMonths = Array.from(monthsSet)
    .map(str => {
      const [year, month] = str.split('-');
      return { year: parseInt(year), month: parseInt(month) };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  res.json({
    ok: true,
    data: {
      availableMonths,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear()
    }
  });
}));

module.exports = router;
