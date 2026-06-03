const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getCustomers,
  getTickets,
  createTicket,
  updateTicket,
  getActivities
} = require('../controllers/crm.controller');

router.use(requireAuth, requireRole(['Admin', 'Manager', 'Client']));

router.get('/leads', getLeads);
router.get('/leads/:id', getLeadById);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

// Customers
router.get('/customers', getCustomers);

// Tickets
router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket);

// Activities
router.get('/activities', getActivities);

module.exports = router;
