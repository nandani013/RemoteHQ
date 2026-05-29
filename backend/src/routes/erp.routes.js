const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac');
const {
  getEmployees, createEmployee,
  getProjects, updateProjectStatus,
  getAttendance, clockIn, clockOut,
  getFinanceRecords, createFinanceRecord
} = require('../controllers/erp.controller');

const router = express.Router();
router.use(requireAuth, requireRole(['Admin', 'Manager', 'Employee']));

router.get('/employees', getEmployees);
router.post('/employees', createEmployee);

router.get('/projects', getProjects);
router.put('/projects/:id/status', updateProjectStatus);

router.get('/attendance', getAttendance);
router.post('/attendance/clock-in', clockIn);
router.post('/attendance/clock-out', clockOut);

router.get('/finance', getFinanceRecords);
router.post('/finance', createFinanceRecord);

module.exports = router;
