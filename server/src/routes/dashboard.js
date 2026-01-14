const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();
const usersService = new FirestoreService('User');
const subscriptionsService = new FirestoreService('Subscription');
const paymentsService = new FirestoreService('PaymentHistory');
const ticketsService = new FirestoreService('SupportTicket');
const installationsService = new FirestoreService('Installation');
const plansService = new FirestoreService('Plan');

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();
  const tomorrowStr = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();
  
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  const currentMonthStr = currentMonth.toISOString();

  // Get all data in parallel
  const [
    allUsers,
    allSubscriptions,
    allPayments,
    allTickets,
    allInstallations
  ] = await Promise.all([
    usersService.findAll({ where: [['role', '==', 'client']] }),
    subscriptionsService.findAll({ where: [] }),
    paymentsService.findAll({ where: [] }),
    ticketsService.findAll({ where: [] }),
    installationsService.findAll({ where: [] })
  ]);

  // Calculate stats
  const totalUsers = allUsers.length;
  const activeClients = allUsers.filter(u => u.isActive !== false).length;

  const totalSubscriptions = allSubscriptions.length;
  const activeSubscriptions = allSubscriptions.filter(s => s.status === 'Active').length;
  const suspendedSubscriptions = allSubscriptions.filter(s => s.status === 'Suspended').length;

  const paidPayments = allPayments.filter(p => p.status === 'Paid');
  const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const monthlyPaidPayments = paidPayments.filter(p => p.datePaid >= currentMonthStr);
  const monthlyRevenue = monthlyPaidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const unpaidPayments = allPayments.filter(p => p.status === 'Not Yet Paid').length;

  const openTickets = allTickets.filter(t => ['Open', 'In Progress'].includes(t.status)).length;
  const criticalTickets = allTickets.filter(t => t.priority === 'Critical' && !['Resolved', 'Closed'].includes(t.status)).length;

  const pendingInstallations = allInstallations.filter(i => ['Scheduled', 'In Progress'].includes(i.status)).length;
  const todaysInstallations = allInstallations.filter(i => 
    i.preferredDate >= todayStr && 
    i.preferredDate < tomorrowStr && 
    ['Scheduled', 'In Progress'].includes(i.status)
  ).length;

  // Recent data
  const recentPayments = paidPayments
    .sort((a, b) => (b.datePaid || b.createdAt || '').localeCompare(a.datePaid || a.createdAt || ''))
    .slice(0, 5);

  const recentTickets = allTickets
    .filter(t => ['Open', 'In Progress'].includes(t.status))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  const recentSubscriptions = allSubscriptions
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  res.json({
    ok: true,
    data: {
      users: {
        total: totalUsers,
        active: activeClients
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        suspended: suspendedSubscriptions
      },
      payments: {
        totalRevenue,
        monthlyRevenue,
        unpaid: unpaidPayments
      },
      tickets: {
        open: openTickets,
        critical: criticalTickets
      },
      installations: {
        pending: pendingInstallations,
        today: todaysInstallations
      },
      recent: {
        payments: recentPayments,
        tickets: recentTickets,
        subscriptions: recentSubscriptions
      }
    }
  });
}));

// @route   GET /api/dashboard/revenue-chart
// @desc    Get revenue data for charts (last 6 months)
// @access  Private/Admin
router.get('/revenue-chart', asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString();

  const allPaidPayments = await paymentsService.findAll({
    where: [['status', '==', 'Paid']]
  });

  // Filter by date and group by month
  const monthlyData = {};
  allPaidPayments
    .filter(p => (p.datePaid || p.createdAt) >= sixMonthsAgoStr)
    .forEach(p => {
      const date = new Date(p.datePaid || p.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { revenue: 0, count: 0 };
      }
      monthlyData[key].revenue += p.amount || 0;
      monthlyData[key].count += 1;
    });

  // Format for chart
  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      revenue: data.revenue,
      transactions: data.count
    }));

  res.json({ ok: true, data: chartData });
}));

// @route   GET /api/dashboard/subscription-breakdown
// @desc    Get subscription breakdown by plan
// @access  Private/Admin
router.get('/subscription-breakdown', asyncHandler(async (req, res) => {
  const [activeSubscriptions, allPlans] = await Promise.all([
    subscriptionsService.findAll({ where: [['status', '==', 'Active']] }),
    plansService.findAll({ where: [] })
  ]);

  // Create plan lookup
  const planMap = {};
  allPlans.forEach(p => {
    planMap[p.id] = p;
  });

  // Group by plan
  const breakdownMap = {};
  activeSubscriptions.forEach(sub => {
    const plan = planMap[sub.planId];
    const planName = plan?.name || 'Unknown';
    const planPrice = plan?.price || 0;
    
    if (!breakdownMap[planName]) {
      breakdownMap[planName] = { count: 0, revenue: 0 };
    }
    breakdownMap[planName].count += 1;
    breakdownMap[planName].revenue += planPrice;
  });

  const breakdown = Object.entries(breakdownMap)
    .map(([name, data]) => ({
      _id: name,
      count: data.count,
      revenue: data.revenue
    }))
    .sort((a, b) => b.count - a.count);

  res.json({ ok: true, data: breakdown });
}));

module.exports = router;
