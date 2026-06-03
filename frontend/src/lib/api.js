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
  // Sales Automation APIs
  preCallSummary: async (leadId) => {
    const res = await fetch(`${API_BASE}/sales-automation/pre-call-summary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ leadId })
    });
    if (!res.ok) throw new Error('Failed to get pre-call summary');
    return res.json();
  },
  analyzeTranscript: async (transcript) => {
    const res = await fetch(`${API_BASE}/sales-automation/analyze-transcript`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ transcript })
    });
    if (!res.ok) throw new Error('Failed to analyze transcript');
    return res.json();
  },
  createTasks: async (leadId, transcript) => {
    const res = await fetch(`${API_BASE}/sales-automation/create-tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ leadId, transcript })
    });
    if (!res.ok) throw new Error('Failed to create tasks');
    return res.json();
  },
  getRecommendations: async (leadId) => {
    const res = await fetch(`${API_BASE}/sales-automation/recommendations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ leadId })
    });
    if (!res.ok) throw new Error('Failed to get recommendations');
    return res.json();
  },
  generateEmail: async (leadId, transcript, recipientName) => {
    const res = await fetch(`${API_BASE}/sales-automation/generate-email`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ leadId, transcript, recipientName })
    });
    if (!res.ok) throw new Error('Failed to generate email');
    return res.json();
  },
  createTasksFromTranscript: async (leadId, transcript) => {
    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/create-tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ transcript })
    });
    if (!res.ok) throw new Error('Failed to create tasks from transcript');
    return res.json();
  },

  // Customers
  getCustomers: async () => {
    const res = await fetch(`${API_BASE}/crm/customers`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },
  getPreCallSummary: async (id) => {
    const res = await fetch(`${API_BASE}/crm/customers/${id}/pre-call-summary`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch pre-call summary');
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
  generateEmailDraft: async (leadId, transcript, recipientName) => {
    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/generate-email-draft`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ transcript, recipientName })
    });
    if (!res.ok) throw new Error('Failed to generate email draft');
    return res.json();
  },
  getActivities: async () => {
    const res = await fetch(`${API_BASE}/crm/activities`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },
};
