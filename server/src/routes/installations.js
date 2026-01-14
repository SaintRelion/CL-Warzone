const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const installationsService = new FirestoreService('Installation');
const usersService = new FirestoreService('User');

// Helper to populate installation with user details
const populateInstallation = async (installation) => {
  const user = installation.userId ? await usersService.findById(installation.userId) : null;
  return {
    ...installation,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, phoneNumber: user.phoneNumber } : null
  };
};

// All routes require authentication
router.use(protect);

// @route   GET /api/installations
// @desc    Get all installations (admin) or user's installations (client)
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, startDate, endDate, page = 1, limit = 20, sortBy = 'preferredDate', sortOrder = 'asc' } = req.query;

  const where = [];
  if (req.user.role !== 'admin') {
    where.push(['userId', '==', req.user.id]);
  }
  if (status) where.push(['status', '==', status]);
  if (startDate) where.push(['preferredDate', '>=', startDate]);
  if (endDate) where.push(['preferredDate', '<=', endDate]);

  const result = await installationsService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  const populatedData = await Promise.all(result.data.map(populateInstallation));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   GET /api/installations/stats/summary
// @desc    Get installation statistics
// @access  Private/Admin
router.get('/stats/summary', restrictTo('admin'), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayStr = today.toISOString();
  const tomorrowStr = tomorrow.toISOString();

  const [total, scheduled, inProgress, completed, cancelled] = await Promise.all([
    installationsService.count(),
    installationsService.count([['status', '==', 'Scheduled']]),
    installationsService.count([['status', '==', 'In Progress']]),
    installationsService.count([['status', '==', 'Completed']]),
    installationsService.count([['status', '==', 'Cancelled']])
  ]);

  // Get today's installations
  const allScheduled = await installationsService.findAll({
    where: []
  });
  const todaysInstallations = allScheduled.filter(i => 
    i.preferredDate >= todayStr && 
    i.preferredDate < tomorrowStr && 
    ['Scheduled', 'In Progress'].includes(i.status)
  ).length;

  res.json({
    ok: true,
    data: {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
      todaysInstallations,
      pending: scheduled + inProgress
    }
  });
}));

// @route   GET /api/installations/:id
// @desc    Get installation by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const installation = await installationsService.findById(req.params.id);
  
  if (!installation) {
    return res.status(404).json({ error: 'Installation not found' });
  }

  if (req.user.role !== 'admin' && installation.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to access this installation' });
  }

  const populated = await populateInstallation(installation);
  res.json({ ok: true, data: populated });
}));

// @route   POST /api/installations
// @desc    Schedule new installation
// @access  Private
router.post('/', logActivity('Schedule Installation', 'Installation'), asyncHandler(async (req, res) => {
  const { subscriptionId, preferredDate, preferredTime, address, contactNumber, notes } = req.body;

  const installation = await installationsService.create({
    userId: req.user.id,
    subscriptionId,
    preferredDate,
    preferredTime,
    address,
    contactNumber: contactNumber || req.user.phoneNumber,
    notes,
    status: 'Scheduled'
  });

  const populated = await populateInstallation(installation);
  res.status(201).json({ ok: true, data: populated });
}));

// @route   PUT /api/installations/:id
// @desc    Update installation
// @access  Private
router.put('/:id', logActivity('Update Installation', 'Installation'), asyncHandler(async (req, res) => {
  const installation = await installationsService.findById(req.params.id);
  
  if (!installation) {
    return res.status(404).json({ error: 'Installation not found' });
  }

  if (req.user.role !== 'admin') {
    if (installation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this installation' });
    }
    if (installation.status !== 'Scheduled') {
      return res.status(400).json({ error: 'Can only modify scheduled installations' });
    }
  }

  const allowedFields = req.user.role === 'admin' 
    ? ['preferredDate', 'preferredTime', 'address', 'contactNumber', 'status', 'assignedTechnician', 'notes']
    : ['preferredDate', 'preferredTime', 'address', 'contactNumber', 'notes'];

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // If completing installation, set completed date
  if (updateData.status === 'Completed' && installation.status !== 'Completed') {
    updateData.completedAt = new Date().toISOString();
  }

  const updatedInstallation = await installationsService.update(req.params.id, updateData);
  const populated = await populateInstallation(updatedInstallation);

  res.json({ ok: true, data: populated });
}));

// @route   PUT /api/installations/:id/status
// @desc    Update installation status
// @access  Private/Admin
router.put('/:id/status', restrictTo('admin'), logActivity('Update Installation Status', 'Installation'), asyncHandler(async (req, res) => {
  const { status, assignedTechnician } = req.body;
  
  if (!['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const updateData = { status };
  if (assignedTechnician) updateData.assignedTechnician = assignedTechnician;
  if (status === 'Completed') updateData.completedAt = new Date().toISOString();

  const installation = await installationsService.update(req.params.id, updateData);

  if (!installation) {
    return res.status(404).json({ error: 'Installation not found' });
  }

  const populated = await populateInstallation(installation);
  res.json({ ok: true, data: populated });
}));

// @route   DELETE /api/installations/:id
// @desc    Cancel installation
// @access  Private
router.delete('/:id', logActivity('Cancel Installation', 'Installation'), asyncHandler(async (req, res) => {
  const installation = await installationsService.findById(req.params.id);

  if (!installation) {
    return res.status(404).json({ error: 'Installation not found' });
  }

  if (req.user.role !== 'admin') {
    if (installation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this installation' });
    }
    if (!['Scheduled', 'Rescheduled'].includes(installation.status)) {
      return res.status(400).json({ error: 'Can only cancel scheduled installations' });
    }
  }

  await installationsService.update(req.params.id, { status: 'Cancelled' });

  res.json({ ok: true, message: 'Installation cancelled successfully' });
}));

module.exports = router;
