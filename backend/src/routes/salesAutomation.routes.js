const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac');
const {
  preCallSummary,
  analyzeTranscript,
  createTasks,
  recommendations,
  generateEmail
} = require('../controllers/salesAutomation.controller');

router.use(requireAuth, requireRole(['Admin', 'Manager', 'Client']));

router.post('/pre-call-summary', preCallSummary);
router.post('/analyze-transcript', analyzeTranscript);
router.post('/create-tasks', createTasks);
router.post('/recommendations', recommendations);
router.post('/generate-email', generateEmail);

module.exports = router;
