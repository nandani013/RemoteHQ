const prisma = require('../lib/prisma');

// Leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id }
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const { name, company, email, phone, dealValue } = req.body;
    const lead = await prisma.lead.create({
      data: { name, company, email, phone, dealValue: Number(dealValue) || 0 }
    });
    
    await prisma.activity.create({
      data: {
        description: `New lead created: ${name} from ${company}`,
        type: 'LEAD_CREATED'
      }
    });
    
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, email, phone, status, dealValue } = req.body;
    
    // Check if status changes to WON
    const oldLead = await prisma.lead.findUnique({ where: { id } });
    if (!oldLead) return res.status(404).json({ error: 'Lead not found' });
    
    const lead = await prisma.lead.update({
      where: { id },
      data: { name, company, email, phone, status, dealValue: dealValue ? Number(dealValue) : undefined }
    });
    
    if (status === 'WON' && oldLead.status !== 'WON') {
      // Auto-create customer
      const existingCustomer = await prisma.customer.findUnique({ where: { leadId: id } });
      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            leadId: id,
            name: lead.name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone
          }
        });
        await prisma.activity.create({
          data: {
            description: `Customer created for lead ${lead.name}`,
            type: 'CUSTOMER_CREATED'
          }
        });
        
        // Find a random employee to assign as manager (fallback if none)
        const employees = await prisma.employee.findMany();
        const managerId = employees.length > 0 ? employees[0].id : null;
        // Fetch manager details for notifications
        const manager = managerId ? await prisma.employee.findUnique({ where: { id: managerId } }) : null;

        // Auto-create Project
                // Auto-create Project and capture its ID
        const project = await prisma.project.create({
          data: {
            name: `Project: ${lead.company} - ${lead.name}`,
            managerId,
            status: 'PLANNING',
            budget: lead.dealValue || 0
          }
        });
        // Log project creation activity
        await prisma.activity.create({
          data: {
            description: `Project ${project.name} created for lead ${lead.name}`,
            type: 'PROJECT_CREATED'
          }
        });
        // Emit project creation notification via Socket.io
        const ioProj = req.app.get('io');
        if (ioProj) {
          ioProj.emit('team_notification', {
            title: 'Project Created',
            message: `Project ${project.name} has been created and assigned to manager ${manager?.name || 'Unassigned'}.`,
            type: 'PROJECT_CREATED',
            projectId: project.id
          });
        }

        await prisma.activity.create({
          data: {
            description: `Lead ${lead.name} won! Converted to Customer and Project Created.`,
            type: 'DEAL_WON'
          }
        });
        // Emit manager assignment notification via Socket.io (already emitted later with projectId)
        // No change needed here as manager notification will include projectId from earlier step.
        // Create finance record for project budget
        await prisma.financeRecord.create({
          data: {
            type: 'REVENUE',
            amount: lead.dealValue || 0,
            category: 'Project Budget',
            description: `Budget for project ${lead.company} - ${lead.name}`,
            date: new Date()
          }
        });
        // Log finance activity
        await prisma.activity.create({
          data: {
            description: `Finance record created for project ${lead.company} - ${lead.name}`,
            type: 'FINANCE_RECORD_CREATED'
          }
        });
        // Emit finance record notification via Socket.io
        const ioFin = req.app.get('io');
        if (ioFin) {
          ioFin.emit('team_notification', {
            title: 'Finance Record Created',
            message: `Finance record for project ${lead.company} - ${lead.name} added.`,
            type: 'FINANCE_RECORD_CREATED',
            projectId: project.id
          });
        }
        // Log manager assignment activity
        await prisma.activity.create({
          data: {
            description: `Manager ${manager?.name || 'Unassigned'} assigned to project ${lead.company} - ${lead.name}`,
            type: 'MANAGER_ASSIGNED'
          }
        });
      }
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally delete related customer if needed, but let's just delete the lead
    // Prisma will throw error if customer exists due to relation, so delete customer first if any
    await prisma.customer.deleteMany({ where: { leadId: id } });
    await prisma.lead.delete({ where: { id } });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tickets
exports.getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const ticket = await prisma.ticket.create({
      data: { title, description, assignedTo }
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status, assignedTo }
    });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activities
exports.getActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
