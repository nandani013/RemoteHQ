const API_BASE = 'http://localhost:5003/api';

// Helper to include Authorization header if token exists
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const crmApi = {
  // Leads
  getLeads: async () => {
    const res = await fetch(`${API_BASE}/crm/leads`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },
  getLead: async (id) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch lead');
    return res.json();
  },
  createLead: async (data) => {
    const res = await fetch(`${API_BASE}/crm/leads`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to create lead');
    return res.json();
  },
  updateLead: async ({ id, ...data }) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
  },
  deleteLead: async (id) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to delete lead');
    return res.json();
  },

  // Customers
  getCustomers: async () => {
    const res = await fetch(`${API_BASE}/crm/customers`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  // Tickets
  getTickets: async () => {
    const res = await fetch(`${API_BASE}/crm/tickets`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },
  createTicket: async (data) => {
    const res = await fetch(`${API_BASE}/crm/tickets`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  },
  updateTicket: async ({ id, ...data }) => {
    const res = await fetch(`${API_BASE}/crm/tickets/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  },

  // Activities
  getActivities: async () => {
    const res = await fetch(`${API_BASE}/crm/activities`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },
};
