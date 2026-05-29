const API_BASE = 'http://localhost:5001/api';

export const crmApi = {
  // Leads
  getLeads: async () => {
    const res = await fetch(`${API_BASE}/crm/leads`);
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },
  getLead: async (id) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`);
    if (!res.ok) throw new Error('Failed to fetch lead');
    return res.json();
  },
  createLead: async (data) => {
    const res = await fetch(`${API_BASE}/crm/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    return res.json();
  },
  updateLead: async ({ id, ...data }) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
  },
  deleteLead: async (id) => {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete lead');
    return res.json();
  },

  // Customers
  getCustomers: async () => {
    const res = await fetch(`${API_BASE}/crm/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  // Tickets
  getTickets: async () => {
    const res = await fetch(`${API_BASE}/crm/tickets`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },
  createTicket: async (data) => {
    const res = await fetch(`${API_BASE}/crm/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  },
  updateTicket: async ({ id, ...data }) => {
    const res = await fetch(`${API_BASE}/crm/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  },

  // Activities
  getActivities: async () => {
    const res = await fetch(`${API_BASE}/crm/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  }
};
