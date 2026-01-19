const FirestoreService = require('../lib/firestore');

const activityLogService = new FirestoreService('ActivityLog');

// Log activity middleware
const logActivity = (action, entityType) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    res.send = function(data) {
      // Only log on successful responses
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        let entityId = null;
        
        try {
          const responseData = JSON.parse(data);
          entityId = responseData?.data?.id || responseData?.id || req.params.id;
        } catch (e) {
          entityId = req.params.id;
        }

        // Log asynchronously, don't wait
        activityLogService.create({
          userId: req.user.id,
          action: action,
          entityType: entityType,
          entityId: entityId,
          details: {
            method: req.method,
            path: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined
          },
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.get('User-Agent')
        }).catch(err => console.error('Activity log error:', err));
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

module.exports = { logActivity };
