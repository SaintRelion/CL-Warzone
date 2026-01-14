const express = require('express');
const FirestoreService = require('../lib/firestore');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLog');

const router = express.Router();
const ticketsService = new FirestoreService('SupportTicket');
const usersService = new FirestoreService('User');

// Helper to populate ticket with user details
const populateTicket = async (ticket) => {
  const user = ticket.userId ? await usersService.findById(ticket.userId) : null;
  
  // Populate responder details if there are responses
  let responses = ticket.responses || [];
  if (responses.length > 0) {
    responses = await Promise.all(responses.map(async (r) => {
      const responder = r.responderId ? await usersService.findById(r.responderId) : null;
      return {
        ...r,
        responder: responder ? { id: responder.id, firstName: responder.firstName, lastName: responder.lastName, role: responder.role } : null
      };
    }));
  }
  
  return {
    ...ticket,
    responses,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress } : null
  };
};

// All routes require authentication
router.use(protect);

// @route   GET /api/tickets
// @desc    Get all tickets (admin) or user's tickets (client)
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, priority, category, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const where = [];
  if (req.user.role !== 'admin') {
    where.push(['userId', '==', req.user.id]);
  }
  if (status) where.push(['status', '==', status]);
  if (priority) where.push(['priority', '==', priority]);
  if (category) where.push(['category', '==', category]);

  const result = await ticketsService.findWithPagination({
    where,
    orderBy: sortBy,
    orderDirection: sortOrder,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  const populatedData = await Promise.all(result.data.map(populateTicket));

  res.json({
    ok: true,
    data: populatedData,
    pagination: result.pagination
  });
}));

// @route   GET /api/tickets/stats/summary
// @desc    Get ticket statistics
// @access  Private/Admin
router.get('/stats/summary', restrictTo('admin'), asyncHandler(async (req, res) => {
  const [total, open, inProgress, resolved, closed] = await Promise.all([
    ticketsService.count(),
    ticketsService.count([['status', '==', 'Open']]),
    ticketsService.count([['status', '==', 'In Progress']]),
    ticketsService.count([['status', '==', 'Resolved']]),
    ticketsService.count([['status', '==', 'Closed']])
  ]);

  // For critical/high priority tickets, we need to filter manually since Firestore doesn't support $nin
  const allActive = await ticketsService.findAll({
    where: []
  });
  const critical = allActive.filter(t => t.priority === 'Critical' && !['Resolved', 'Closed'].includes(t.status)).length;
  const high = allActive.filter(t => t.priority === 'High' && !['Resolved', 'Closed'].includes(t.status)).length;

  res.json({
    ok: true,
    data: {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      high,
      pending: open + inProgress
    }
  });
}));

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const ticket = await ticketsService.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to access this ticket' });
  }

  const populated = await populateTicket(ticket);
  res.json({ ok: true, data: populated });
}));

// @route   POST /api/tickets
// @desc    Create new support ticket
// @access  Private
router.post('/', logActivity('Create Ticket', 'Ticket'), asyncHandler(async (req, res) => {
  const { title, description, priority, category } = req.body;

  const ticket = await ticketsService.create({
    userId: req.user.id,
    title,
    description,
    priority: priority || 'Medium',
    category: category || 'Other',
    status: 'Open',
    responses: []
  });

  const populated = await populateTicket(ticket);
  res.status(201).json({ ok: true, data: populated });
}));

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private
router.put('/:id', logActivity('Update Ticket', 'Ticket'), asyncHandler(async (req, res) => {
  const ticket = await ticketsService.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this ticket' });
  }

  const allowedFields = req.user.role === 'admin' 
    ? ['title', 'description', 'priority', 'category', 'status', 'assignedTo']
    : ['title', 'description'];

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // If resolving ticket, set resolved date
  if (updateData.status === 'Resolved' && ticket.status !== 'Resolved') {
    updateData.resolvedAt = new Date().toISOString();
  }

  const updatedTicket = await ticketsService.update(req.params.id, updateData);
  const populated = await populateTicket(updatedTicket);

  res.json({ ok: true, data: populated });
}));

// @route   POST /api/tickets/:id/respond
// @desc    Add response to ticket
// @access  Private
router.post('/:id/respond', logActivity('Respond to Ticket', 'Ticket'), asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ticket = await ticketsService.findById(req.params.id);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to respond to this ticket' });
  }

  const responses = ticket.responses || [];
  responses.push({
    responderId: req.user.id,
    message: message.trim(),
    createdAt: new Date().toISOString()
  });

  const updateData = { responses };

  // If admin responds, set status to In Progress if currently Open
  if (req.user.role === 'admin' && ticket.status === 'Open') {
    updateData.status = 'In Progress';
  }

  const updatedTicket = await ticketsService.update(req.params.id, updateData);
  const populated = await populateTicket(updatedTicket);

  res.json({ ok: true, data: populated });
}));

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status
// @access  Private/Admin
router.put('/:id/status', restrictTo('admin'), logActivity('Update Ticket Status', 'Ticket'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const updateData = { status };
  if (status === 'Resolved') {
    updateData.resolvedAt = new Date().toISOString();
  }

  const ticket = await ticketsService.update(req.params.id, updateData);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const populated = await populateTicket(ticket);
  res.json({ ok: true, data: populated });
}));

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket
// @access  Private/Admin
router.delete('/:id', restrictTo('admin'), logActivity('Delete Ticket', 'Ticket'), asyncHandler(async (req, res) => {
  const deleted = await ticketsService.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  res.json({ ok: true, message: 'Ticket deleted successfully' });
}));

module.exports = router;
