const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();
const activityLogsService = new FirestoreService('ActivityLog');
const usersService = new FirestoreService('User');

// Helper to populate log with user details
const populateLog = async (log) => {
  const user = log.userId ? await usersService.findById(log.userId) : null;
  return {
    ...log,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress } : null
  };
};

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

// @route   GET /api/activity-logs
// @desc    Get all activity logs
// @access  Private/Admin
router.get('/', asyncHandler(async (req, res) => {
  const { 
    userId, 
    entityType, 
    startDate, 
    endDate, 
    page = 1, 
    limit = 50, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = req.query;

  const where = [];
  if (userId) where.push(['userId', '==', userId]);
  if (entityType) where.push(['entityType', '==', entityType]);
  if (startDate) where.push(['createdAt', '>=', startDate]);
  if (endDate) where.push(['createdAt', '<=', endDate]);

  const result = await activityLogsService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  const populatedData = await Promise.all(result.data.map(populateLog));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   GET /api/activity-logs/stats/summary
// @desc    Get activity log statistics
// @access  Private/Admin
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const allLogs = await activityLogsService.findAll({ where: [] });

  const totalLogs = allLogs.length;
  const todayLogs = allLogs.filter(l => l.createdAt >= todayStr).length;

  // Entity breakdown
  const entityBreakdown = {};
  allLogs.forEach(log => {
    const entity = log.entityType || 'Unknown';
    entityBreakdown[entity] = (entityBreakdown[entity] || 0) + 1;
  });

  // Recent activity
  const recentActivity = allLogs
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 10);

  res.json({
    ok: true,
    data: {
      totalLogs,
      todayLogs,
      entityBreakdown,
      recentActivity
    }
  });
}));

// @route   GET /api/activity-logs/user/:userId
// @desc    Get activity logs for a specific user
// @access  Private/Admin
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await activityLogsService.findWithPagination({
    where: [['userId', '==', req.params.userId]],
    orderBy: 'createdAt',
    orderDirection: 'desc',
    page: parseInt(page),
    limit: parseInt(limit)
  });

  const populatedData = await Promise.all(result.data.map(populateLog));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   DELETE /api/activity-logs/clear
// @desc    Clear old activity logs (older than 90 days)
// @access  Private/Admin
router.delete('/clear', asyncHandler(async (req, res) => {
  const { daysOld = 90 } = req.query;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));
  const cutoffStr = cutoffDate.toISOString();

  const oldLogs = await activityLogsService.findAll({
    where: []
  });

  const logsToDelete = oldLogs.filter(l => l.createdAt < cutoffStr);
  let deletedCount = 0;

  for (const log of logsToDelete) {
    await activityLogsService.delete(log.id);
    deletedCount++;
  }

  res.json({
    ok: true,
    message: `Deleted ${deletedCount} activity logs older than ${daysOld} days`
  });
}));

module.exports = router;
