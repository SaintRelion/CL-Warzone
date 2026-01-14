const express = require('express');
const bcrypt = require('bcryptjs');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const usersService = new FirestoreService('User');

// All routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', restrictTo('admin'), asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const where = [];
  if (role) where.push(['role', '==', role]);

  const result = await usersService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  // Filter by search if provided (client-side filtering for text search)
  let data = result.data;
  if (search) {
    const searchLower = search.toLowerCase();
    data = data.filter(user => 
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.emailAddress?.toLowerCase().includes(searchLower)
    );
  }

  // Remove passwords from response
  data = data.map(({ passwordHash, ...user }) => user);

  res.json({
    ok: true,
    data,
    pagination: result.pagination
  });
}));

// @route   GET /api/users/stats/summary
// @desc    Get user statistics (admin only)
// @access  Private/Admin
router.get('/stats/summary', restrictTo('admin'), asyncHandler(async (req, res) => {
  const [totalUsers, activeUsers, adminUsers, clientUsers] = await Promise.all([
    usersService.count(),
    usersService.count([['isActive', '==', true]]),
    usersService.count([['role', '==', 'admin']]),
    usersService.count([['role', '==', 'client']])
  ]);

  res.json({
    ok: true,
    data: {
      totalUsers,
      activeUsers,
      adminUsers,
      clientUsers
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not authorized to access this user data' });
  }

  const user = await usersService.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ ok: true, data: userWithoutPassword });
}));

// @route   POST /api/users
// @desc    Create new user (admin only)
// @access  Private/Admin
router.post('/', restrictTo('admin'), logActivity('Create User', 'User'), asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password, role, phoneNumber, streetAddress, city, zipCode, serviceArea } = req.body;

  const existingUser = await usersService.findOne([['emailAddress', '==', emailAddress.toLowerCase()]]);
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await usersService.create({
    firstName,
    lastName,
    emailAddress: emailAddress.toLowerCase(),
    passwordHash: hashedPassword,
    role: role || 'client',
    phoneNumber: phoneNumber || '',
    streetAddress: streetAddress || '',
    city: city || '',
    zipCode: zipCode || '',
    serviceArea: serviceArea || '',
    isActive: true
  });

  const { passwordHash, ...userWithoutPassword } = user;
  res.status(201).json({ ok: true, data: userWithoutPassword });
}));

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', logActivity('Update User', 'User'), asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not authorized to update this user' });
  }

  const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'streetAddress', 'city', 'zipCode', 'serviceArea'];
  
  if (req.user.role === 'admin') {
    allowedFields.push('role', 'isActive');
  }

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const user = await usersService.update(req.params.id, updateData);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ ok: true, data: userWithoutPassword });
}));

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete - deactivate)
// @access  Private/Admin
router.delete('/:id', restrictTo('admin'), logActivity('Delete User', 'User'), asyncHandler(async (req, res) => {
  const user = await usersService.update(req.params.id, { isActive: false });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ ok: true, message: 'User deactivated successfully' });
}));

module.exports = router;
