const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const plansService = new FirestoreService('Plan');

// @route   GET /api/plans
// @desc    Get all plans
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { active, search, sortBy = 'price', sortOrder = 'asc' } = req.query;

  const where = [];
  if (active !== undefined) where.push(['isActive', '==', active === 'true']);

  const plans = await plansService.findAll({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder
  });

  // Filter by search if provided
  let data = plans;
  if (search) {
    const searchLower = search.toLowerCase();
    data = plans.filter(plan => 
      plan.name?.toLowerCase().includes(searchLower) ||
      plan.description?.toLowerCase().includes(searchLower)
    );
  }

  res.json({ ok: true, data });
}));

// @route   GET /api/plans/:id
// @desc    Get plan by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const plan = await plansService.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json({ ok: true, data: plan });
}));

// Protected routes below
router.use(protect);

// @route   POST /api/plans
// @desc    Create new plan
// @access  Private/Admin
router.post('/', restrictTo('admin'), logActivity('Create Plan', 'Plan'), asyncHandler(async (req, res) => {
  const { name, speed, price, features, description } = req.body;

  const plan = await plansService.create({
    name,
    speed,
    price: Number(price),
    features: features || [],
    description: description || '',
    isActive: true
  });

  res.status(201).json({ ok: true, data: plan });
}));

// @route   PUT /api/plans/:id
// @desc    Update plan
// @access  Private/Admin
router.put('/:id', restrictTo('admin'), logActivity('Update Plan', 'Plan'), asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'speed', 'price', 'features', 'description', 'isActive'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = field === 'price' ? Number(req.body[field]) : req.body[field];
    }
  });

  const plan = await plansService.update(req.params.id, updateData);

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json({ ok: true, data: plan });
}));

// @route   DELETE /api/plans/:id
// @desc    Delete plan (soft delete)
// @access  Private/Admin
router.delete('/:id', restrictTo('admin'), logActivity('Delete Plan', 'Plan'), asyncHandler(async (req, res) => {
  const plan = await plansService.update(req.params.id, { isActive: false });

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json({ ok: true, message: 'Plan deactivated successfully' });
}));

module.exports = router;
