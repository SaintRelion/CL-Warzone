const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const paymentsService = new FirestoreService('PaymentHistory');
const subscriptionsService = new FirestoreService('Subscription');
const usersService = new FirestoreService('User');

// Helper to populate payment with user details
const populatePayment = async (payment) => {
  const user = payment.userId ? await usersService.findById(payment.userId) : null;
  return {
    ...payment,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress } : null
  };
};

// All routes require authentication
router.use(protect);

// @route   GET /api/payments
// @desc    Get all payments (admin) or user's payments (client)
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, method, startDate, endDate, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const where = [];
  if (req.user.role !== 'admin') {
    where.push(['userId', '==', req.user.id]);
  }
  if (status) where.push(['status', '==', status]);
  if (method) where.push(['method', '==', method]);
  if (startDate) where.push(['createdAt', '>=', startDate]);
  if (endDate) where.push(['createdAt', '<=', endDate]);

  const result = await paymentsService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  const populatedData = await Promise.all(result.data.map(populatePayment));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   GET /api/payments/stats/summary
// @desc    Get payment statistics
// @access  Private/Admin
router.get('/stats/summary', restrictTo('admin'), asyncHandler(async (req, res) => {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  const currentMonthStr = currentMonth.toISOString();

  const [totalPayments, paidPayments, unpaidPayments, totalRevenue] = await Promise.all([
    paymentsService.count(),
    paymentsService.count([['status', '==', 'Paid']]),
    paymentsService.count([['status', '==', 'Not Yet Paid']]),
    paymentsService.sum('amount', [['status', '==', 'Paid']])
  ]);

  // For monthly stats, we need to filter by date
  const allPaidPayments = await paymentsService.findAll({
    where: [['status', '==', 'Paid']]
  });

  const monthlyPayments = allPaidPayments.filter(p => p.createdAt >= currentMonthStr);
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  res.json({
    ok: true,
    data: {
      totalPayments,
      paidPayments,
      unpaidPayments,
      monthlyPayments: monthlyPayments.length,
      totalRevenue,
      monthlyRevenue
    }
  });
}));

// @route   GET /api/payments/user/:userId
// @desc    Get payment history for a specific user
// @access  Private
router.get('/user/:userId', asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Not authorized to access this user\'s payment history' });
  }

  const payments = await paymentsService.findAll({
    where: [['userId', '==', req.params.userId]],
    orderBy: 'createdAt',
    orderDirection: 'desc'
  });

  res.json({ ok: true, data: payments });
}));

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const payment = await paymentsService.findById(req.params.id);
  
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  if (req.user.role !== 'admin' && payment.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to access this payment' });
  }

  const populated = await populatePayment(payment);
  res.json({ ok: true, data: populated });
}));

// @route   POST /api/payments
// @desc    Create new payment record
// @access  Private/Admin
router.post('/', restrictTo('admin'), logActivity('Create Payment', 'Payment'), asyncHandler(async (req, res) => {
  const { userId, subscriptionId, description, method, amount, dueDate, status } = req.body;

  const payment = await paymentsService.create({
    userId,
    subscriptionId,
    description: description || 'Monthly subscription fee',
    method,
    amount,
    dueDate: dueDate || new Date().toISOString(),
    status: status || 'Not Yet Paid',
    nextDueDate: new Date(new Date(dueDate || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  const populated = await populatePayment(payment);
  res.status(201).json({ ok: true, data: populated });
}));

// @route   PUT /api/payments/:id
// @desc    Update payment
// @access  Private/Admin
router.put('/:id', restrictTo('admin'), logActivity('Update Payment', 'Payment'), asyncHandler(async (req, res) => {
  const allowedFields = ['description', 'method', 'amount', 'status', 'dueDate', 'transactionRef', 'transactionScreenshot'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const payment = await paymentsService.update(req.params.id, updateData);

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  res.json({ ok: true, data: payment });
}));

// @route   POST /api/payments/:id/process
// @desc    Process payment (cashiering)
// @access  Private/Admin
router.post('/:id/process', restrictTo('admin'), logActivity('Process Payment', 'Payment'), asyncHandler(async (req, res) => {
  const { amountReceived, method, transactionRef, transactionScreenshot } = req.body;

  const payment = await paymentsService.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  if (payment.status === 'Paid') {
    return res.status(400).json({ error: 'Payment has already been processed' });
  }

  const change = amountReceived - payment.amount;
  if (change < 0) {
    return res.status(400).json({ error: 'Amount received is less than the payment amount' });
  }

  const nextDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const updatedPayment = await paymentsService.update(req.params.id, {
    status: 'Paid',
    amountReceived,
    change,
    method: method || payment.method,
    datePaid: new Date().toISOString(),
    transactionRef,
    transactionScreenshot,
    nextDueDate
  });

  // Update subscription balance if applicable
  if (payment.subscriptionId) {
    await subscriptionsService.update(payment.subscriptionId, {
      balance: 0,
      nextBillingDate: nextDueDate
    });
  }

  const populated = await populatePayment(updatedPayment);
  res.json({ ok: true, data: populated, message: 'Payment processed successfully' });
}));

// @route   DELETE /api/payments/:id
// @desc    Delete payment record
// @access  Private/Admin
router.delete('/:id', restrictTo('admin'), logActivity('Delete Payment', 'Payment'), asyncHandler(async (req, res) => {
  const deleted = await paymentsService.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  res.json({ ok: true, message: 'Payment deleted successfully' });
}));

module.exports = router;
