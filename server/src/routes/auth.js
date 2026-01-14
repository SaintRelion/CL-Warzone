const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');

const router = express.Router();
const usersService = new FirestoreService('User');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from response
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    ok: true,
    token,
    user: userWithoutPassword
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('emailAddress').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { firstName, lastName, emailAddress, password, phoneNumber, streetAddress, city, zipCode, serviceArea } = req.body;

  // Check if user already exists
  const existingUser = await usersService.findOne([['emailAddress', '==', emailAddress.toLowerCase()]]);
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await usersService.create({
    firstName,
    lastName,
    emailAddress: emailAddress.toLowerCase(),
    passwordHash: hashedPassword,
    phoneNumber: phoneNumber || '',
    streetAddress: streetAddress || '',
    city: city || '',
    zipCode: zipCode || '',
    serviceArea: serviceArea || '',
    role: 'client',
    isActive: true
  });

  createSendToken(user, 201, res);
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await usersService.findOne([['emailAddress', '==', email.toLowerCase()]]);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if user is active
  if (user.isActive === false) {
    return res.status(401).json({ error: 'Your account has been deactivated. Please contact support.' });
  }

  createSendToken(user, 200, res);
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const { passwordHash, ...userWithoutPassword } = req.user;
  res.json({
    ok: true,
    user: userWithoutPassword
  });
}));

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put('/update-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await usersService.findById(req.user.id);

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const updatedUser = await usersService.update(req.user.id, { passwordHash: hashedPassword });

  createSendToken(updatedUser, 200, res);
}));

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, asyncHandler(async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'streetAddress', 'city', 'zipCode', 'serviceArea'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const user = await usersService.update(req.user.id, updateData);
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    ok: true,
    user: userWithoutPassword
  });
}));

module.exports = router;
