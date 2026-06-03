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
        
        await prisma.activity.create({
          data: {
            description: `Lead ${lead.name} won! Converted to Customer.`,
            type: 'DEAL_WON'
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

// Pre-Call Summary Generation
exports.getPreCallSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        lead: true,
        deals: true
      }
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // AI Mock Logic based on real DB values
    const totalDealValue = customer.deals.reduce((sum, deal) => sum + deal.amount, 0) + (customer.lead?.dealValue || 0);
    const creationDateStr = new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const lastInteractionDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const summary = {
      customerName: customer.company || customer.name,
      lastInteraction: `Demo completed on ${lastInteractionDate}`,
      openTasks: [
        "Send pricing proposal",
        "Schedule technical workshop"
      ],
      risks: [
        "Budget approval pending",
        totalDealValue > 50000 ? "High value deal - requires VP sign-off" : "Competitor evaluated recently"
      ],
      opportunities: [
        "Interested in Enterprise Plan",
        "Potential for cross-selling priority Support package"
      ],
      talkingPoints: [
        "Discuss implementation timeline",
        "Clarify pricing concerns",
        `Review value realized since initial engagement on ${creationDateStr}`
      ]
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Conversation Intelligence
exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' });

    // Simulated AI NLP Analysis
    const text = transcript.toLowerCase();
    const requirements = [];
    const objections = [];
    const commitments = [];
    let decisionMaker = "Unknown";
    const nextSteps = [];

    // Extract Requirements
    if (text.includes("api integration") || text.includes("api")) requirements.push("API Integration");
    if (text.includes("mobile") || text.includes("app")) requirements.push("Mobile App Support");
    if (text.includes("security") || text.includes("sso")) requirements.push("Enterprise Security & SSO");
    if (requirements.length === 0) requirements.push("Core product features");

    // Extract Objections
    if (text.includes("cost") || text.includes("price") || text.includes("expensive") || text.includes("budget")) objections.push("Cost concerns");
    if (text.includes("time") || text.includes("delay")) objections.push("Implementation timeline");
    if (text.includes("competitor") || text.includes("other options")) objections.push("Evaluating competitors");

    // Extract Commitments
    if (text.includes("proposal by friday") || text.includes("friday")) commitments.push("Proposal by Friday");
    if (text.includes("call next week")) commitments.push("Follow-up call next week");
    if (commitments.length === 0) commitments.push("Review materials sent after call");

    // Extract Decision Maker
    if (text.includes("cto")) decisionMaker = "CTO";
    else if (text.includes("ceo")) decisionMaker = "CEO";
    else if (text.includes("vp")) decisionMaker = "VP of Engineering";

    // Extract Next Steps
    if (text.includes("proposal")) nextSteps.push("Share proposal");
    if (text.includes("technical")) nextSteps.push("Arrange technical discussion");
    if (nextSteps.length === 0) nextSteps.push("Send follow-up email with summary");

    // Add a slight delay to simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
      requirements,
      objections,
      commitments,
      decisionMaker,
      nextSteps
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Automated CRM Task Creation from Transcript
exports.createTasksFromTranscript = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' });
    const sentences = transcript.split('.').map(s => s.trim()).filter(Boolean);
    const tasks = [];
    for (const s of sentences) {
      const match = s.match(/^(.*) will (.+?) (tomorrow|next week|by friday|by \w+)/i);
      if (match) {
        let owner = match[1].trim();
        const action = match[2].trim();
        const due = match[3].trim();
        if (owner.toLowerCase() === 'i') owner = 'Sales Rep';
        const title = action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        tasks.push({ title, owner, dueDate: due, leadId: id });
      }
    }
    if (tasks.length === 0) {
      return res.status(200).json({ message: 'No actionable tasks found in transcript' });
    }
    const result = await prisma.crmTask.createMany({ data: tasks });
    res.json({ createdCount: result.count, tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Next Best Action Recommendations
exports.getNextBestAction = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    let recommendation = '';
    switch (lead.status) {
      case 'NEW':
      case 'CONTACTED':
        recommendation = 'Schedule Product Demo';
        break;
      case 'PROPOSAL_SENT':
      case 'NEGOTIATION':
        recommendation = 'Share Proposal';
        break;
      case 'WON':
        recommendation = 'Contract Review Meeting';
        break;
      default:
        recommendation = 'Review Lead';
    }
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Draft Email Generation
exports.generateEmailDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript, recipientName } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Transcript is required' });
    // Extract bullet points from transcript lines starting with '-'
    const lines = transcript.split('\n').map(l => l.trim()).filter(Boolean);
    const bulletPoints = lines.filter(l => l.startsWith('-')).map(l => l.slice(1).trim());
    const subject = "Follow-up on Today's Discussion";
    const body = `Hi ${recipientName || 'John'},\n\nThank you for your time today.\n\nAs discussed:\n\n${bulletPoints.map(p => '• ' + p).join('\n')}\n\nNext Steps:\n\n${bulletPoints.map(p => '• ' + p).join('\n')}\n\nRegards,\nSales Team`;
    res.json({ subject, body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

