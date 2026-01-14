const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const subscriptionsService = new FirestoreService('Subscription');
const usersService = new FirestoreService('User');
const plansService = new FirestoreService('Plan');

// Helper to populate subscription with user and plan details
const populateSubscription = async (subscription) => {
  const [user, plan] = await Promise.all([
    subscription.userId ? usersService.findById(subscription.userId) : null,
    subscription.planId ? plansService.findById(subscription.planId) : null
  ]);
  
  return {
    ...subscription,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, phoneNumber: user.phoneNumber } : null,
    plan: plan ? { id: plan.id, name: plan.name, speed: plan.speed, price: plan.price } : null
  };
};

// All routes require authentication
router.use(protect);

// @route   GET /api/subscriptions
// @desc    Get all subscriptions (admin) or user's subscriptions (client)
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const where = [];
  if (req.user.role !== 'admin') {
    where.push(['userId', '==', req.user.id]);
  }
  if (status) where.push(['status', '==', status]);

  const result = await subscriptionsService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  // Populate user and plan details
  const populatedData = await Promise.all(result.data.map(populateSubscription));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   GET /api/subscriptions/stats/summary
// @desc    Get subscription statistics
// @access  Private/Admin
router.get('/stats/summary', restrictTo('admin'), asyncHandler(async (req, res) => {
  const [total, active, suspended, inactive, pending, totalBalance] = await Promise.all([
    subscriptionsService.count(),
    subscriptionsService.count([['status', '==', 'Active']]),
    subscriptionsService.count([['status', '==', 'Suspended']]),
    subscriptionsService.count([['status', '==', 'Inactive']]),
    subscriptionsService.count([['status', '==', 'Pending']]),
    subscriptionsService.sum('balance')
  ]);

  res.json({
    ok: true,
    data: { total, active, suspended, inactive, pending, totalBalance }
  });
}));

// @route   GET /api/subscriptions/:id
// @desc    Get subscription by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const subscription = await subscriptionsService.findById(req.params.id);
  
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  if (req.user.role !== 'admin' && subscription.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to access this subscription' });
  }

  const populated = await populateSubscription(subscription);
  res.json({ ok: true, data: populated });
}));

// @route   POST /api/subscriptions
// @desc    Create new subscription
// @access  Private
router.post('/', logActivity('Create Subscription', 'Subscription'), asyncHandler(async (req, res) => {
  const { userId, planId, address, nextBillingDate } = req.body;

  const subUserId = req.user.role === 'admin' && userId ? userId : req.user.id;

  const subscription = await subscriptionsService.create({
    userId: subUserId,
    planId,
    address,
    balance: 0,
    nextBillingDate: nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date().toISOString(),
    status: 'Pending'
  });

  const populated = await populateSubscription(subscription);
  res.status(201).json({ ok: true, data: populated });
}));

// @route   PUT /api/subscriptions/:id
// @desc    Update subscription
// @access  Private/Admin
router.put('/:id', restrictTo('admin'), logActivity('Update Subscription', 'Subscription'), asyncHandler(async (req, res) => {
  const allowedFields = ['planId', 'address', 'status', 'balance', 'nextBillingDate'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const subscription = await subscriptionsService.update(req.params.id, updateData);

  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const populated = await populateSubscription(subscription);
  res.json({ ok: true, data: populated });
}));

// @route   PUT /api/subscriptions/:id/status
// @desc    Update subscription status
// @access  Private/Admin
router.put('/:id/status', restrictTo('admin'), logActivity('Update Subscription Status', 'Subscription'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['Active', 'Suspended', 'Inactive', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const subscription = await subscriptionsService.update(req.params.id, { status });

  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const populated = await populateSubscription(subscription);
  res.json({ ok: true, data: populated });
}));

// @route   DELETE /api/subscriptions/:id
// @desc    Cancel subscription
// @access  Private/Admin
router.delete('/:id', restrictTo('admin'), logActivity('Cancel Subscription', 'Subscription'), asyncHandler(async (req, res) => {
  const subscription = await subscriptionsService.update(req.params.id, { status: 'Inactive' });

  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  res.json({ ok: true, message: 'Subscription cancelled successfully' });
}));

module.exports = router;
