const API_BASE = 'http://localhost:5003/api';

export const erpApi = {
  // Employees
  getEmployees: async () => {
    const res = await fetch(`${API_BASE}/erp/employees`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },
  createEmployee: async (data) => {
    const res = await fetch(`${API_BASE}/erp/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create employee');
    return res.json();
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/erp/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },
  updateProjectStatus: async ({ id, status }) => {
    const res = await fetch(`${API_BASE}/erp/projects/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  // Attendance
  getAttendance: async () => {
    const res = await fetch(`${API_BASE}/erp/attendance`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },
  clockIn: async (employeeId) => {
    const res = await fetch(`${API_BASE}/erp/attendance/clock-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to clock in');
    }
    return res.json();
  },
  clockOut: async (employeeId) => {
    const res = await fetch(`${API_BASE}/erp/attendance/clock-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to clock out');
    }
    return res.json();
  },

  // Finance
  getFinanceRecords: async () => {
    const res = await fetch(`${API_BASE}/erp/finance`);
    if (!res.ok) throw new Error('Failed to fetch finance records');
    return res.json();
  },
  createFinanceRecord: async (data) => {
    const res = await fetch(`${API_BASE}/erp/finance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create finance record');
    return res.json();
  },
};
