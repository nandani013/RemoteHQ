const prisma = require('../lib/prisma');

// Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, designation, role } = req.body;
    const emp = await prisma.employee.create({
      data: { name, email, department, designation, role }
    });
    res.status(201).json(emp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { manager: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const project = await prisma.project.update({
      where: { id },
      data: { status }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Attendance
exports.getAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { employee: true },
      orderBy: { clockIn: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clockIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    
    // Check if already clocked in today without clock out
    const existing = await prisma.attendance.findFirst({
      where: { employeeId, date, clockOut: null }
    });
    if (existing) {
      return res.status(400).json({ error: 'Already clocked in' });
    }

    const record = await prisma.attendance.create({
      data: {
        employeeId,
        date,
        clockIn: new Date()
      }
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    
    const existing = await prisma.attendance.findFirst({
      where: { employeeId, date, clockOut: null },
      orderBy: { clockIn: 'desc' }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'No active clock-in found' });
    }

    const clockOutTime = new Date();
    const totalHours = (clockOutTime - existing.clockIn) / (1000 * 60 * 60);

    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        clockOut: clockOutTime,
        totalHours
      }
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Finance
exports.getFinanceRecords = async (req, res) => {
  try {
    const records = await prisma.financeRecord.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFinanceRecord = async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;
    const record = await prisma.financeRecord.create({
      data: { type, amount: Number(amount), category, description }
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
