// backend/src/services/salesAutomation.service.js
const prisma = require('../lib/prisma');

// -------------------- CallTranscript --------------------
exports.getAllCallTranscripts = async () => {
  return prisma.callTranscript.findMany();
};
exports.getCallTranscriptById = async (id) => {
  return prisma.callTranscript.findUnique({ where: { id } });
};
exports.createCallTranscript = async (leadId, transcript) => {
  return prisma.callTranscript.create({ data: { leadId, transcript } });
};
exports.updateCallTranscript = async (id, data) => {
  return prisma.callTranscript.update({ where: { id }, data });
};
exports.deleteCallTranscript = async (id) => {
  return prisma.callTranscript.delete({ where: { id } });
};

// -------------------- ConversationInsight --------------------
exports.getAllConversationInsights = async () => {
  return prisma.conversationInsight.findMany();
};
exports.getConversationInsightById = async (id) => {
  return prisma.conversationInsight.findUnique({ where: { id } });
};
exports.createConversationInsight = async (leadId, callTranscriptId, insights) => {
  return prisma.conversationInsight.create({
    data: { leadId, callTranscriptId, insights }
  });
};
exports.updateConversationInsight = async (id, data) => {
  return prisma.conversationInsight.update({ where: { id }, data });
};
exports.deleteConversationInsight = async (id) => {
  return prisma.conversationInsight.delete({ where: { id } });
};

// -------------------- SalesTask --------------------
exports.getAllSalesTasks = async () => {
  return prisma.salesTask.findMany();
};
exports.getSalesTaskById = async (id) => {
  return prisma.salesTask.findUnique({ where: { id } });
};
exports.createSalesTask = async (title, owner, dueDate, leadId) => {
  return prisma.salesTask.create({
    data: { title, owner, dueDate, leadId }
  });
};
exports.updateSalesTask = async (id, data) => {
  return prisma.salesTask.update({ where: { id }, data });
};
exports.deleteSalesTask = async (id) => {
  return prisma.salesTask.delete({ where: { id } });
};

// -------------------- FollowUpRecommendation --------------------
exports.getAllFollowUpRecommendations = async () => {
  return prisma.followUpRecommendation.findMany();
};
exports.getFollowUpRecommendationById = async (id) => {
  return prisma.followUpRecommendation.findUnique({ where: { id } });
};
exports.createFollowUpRecommendation = async (leadId, recommendation) => {
  return prisma.followUpRecommendation.create({
    data: { leadId, recommendation }
  });
};
exports.updateFollowUpRecommendation = async (id, data) => {
  return prisma.followUpRecommendation.update({ where: { id }, data });
};
exports.deleteFollowUpRecommendation = async (id) => {
  return prisma.followUpRecommendation.delete({ where: { id } });
};

// -------------------- GeneratedEmail --------------------
exports.getAllGeneratedEmails = async () => {
  return prisma.generatedEmail.findMany();
};
exports.getGeneratedEmailById = async (id) => {
  return prisma.generatedEmail.findUnique({ where: { id } });
};
exports.createGeneratedEmail = async (leadId, subject, body) => {
  return prisma.generatedEmail.create({
    data: { leadId, subject, body }
  });
};
exports.updateGeneratedEmail = async (id, data) => {
  return prisma.generatedEmail.update({ where: { id }, data });
};
exports.deleteGeneratedEmail = async (id) => {
  return prisma.generatedEmail.delete({ where: { id } });
};

// ==========================================
// AI Simulation & Business Logic Methods
// ==========================================

exports.preCallSummary = async (leadId) => {
  // Simulate AI fetching data from CRM and generating a summary
  // In a real app, this would use OpenAI/Gemini to analyze past interactions
  
  // Create a record in DB to show outcome
  const mockSummaryText = `Customer: ${leadId}
Last Interaction: Demo completed on 15 May
Open Tasks: Send pricing proposal, Schedule technical workshop
Risks: Budget approval pending
Opportunities: Interested in Enterprise Plan
Recommended Talking Points: Discuss implementation timeline, Clarify pricing concerns`;
  
  try {
    await prisma.callTranscript.create({
      data: { leadId, transcript: mockSummaryText }
    });
  } catch (e) {
    console.log("Mock leadId not found in DB, skipping save");
  }

  return {
    leadId,
    customerName: `Lead ${leadId}`,
    lastInteraction: "Demo completed on 15 May",
    openTasks: [
      "Send pricing proposal",
      "Schedule technical workshop"
    ],
    risks: ["Budget approval pending"],
    opportunities: ["Interested in Enterprise Plan"],
    talkingPoints: [
      "Discuss implementation timeline",
      "Clarify pricing concerns"
    ],
    raw: mockSummaryText
  };
};

exports.analyzeTranscript = async (transcript) => {
  // Simple heuristic/regex to extract info
  const requirements = [];
  const objections = [];
  const commitments = [];
  const nextSteps = [];
  let decisionMaker = "Unknown";
  
  const lower = transcript.toLowerCase();
  
  if (lower.includes("api")) requirements.push("API Integration");
  if (lower.includes("sso") || lower.includes("security")) requirements.push("SSO & Advanced Security");
  if (lower.includes("cost") || lower.includes("price") || lower.includes("expensive")) objections.push("Cost concerns");
  if (lower.includes("timeline") || lower.includes("long")) objections.push("Implementation timeline");
  if (lower.includes("friday") || lower.includes("tomorrow") || lower.includes("next week")) commitments.push("Provide requested materials by deadline");
  if (lower.includes("cto") || lower.includes("ceo") || lower.includes("vp")) decisionMaker = "CTO / Executive Sponsor";
  
  if (lower.includes("proposal")) nextSteps.push("Share pricing proposal");
  if (lower.includes("demo") || lower.includes("technical")) nextSteps.push("Arrange technical discussion");

  // Fallback defaults for testing
  if (requirements.length === 0) requirements.push("Standard Implementation");
  if (objections.length === 0) objections.push("None identified");
  if (nextSteps.length === 0) nextSteps.push("Follow up next week");

  const insightsData = {
    requirements,
    objections,
    commitments,
    nextSteps,
    decisionMaker
  };

  try {
    await prisma.conversationInsight.create({
      data: { 
        leadId: null, // Lead is optional
        insights: JSON.stringify(insightsData)
      }
    });
  } catch (e) {
    console.log("Skipping insight DB save due to missing lead", e.message);
  }

  return insightsData;
};

exports.createTasks = async (leadId, transcript) => {
  // Extract actionable items and create tasks
  const tasks = [];
  const lower = transcript.toLowerCase();
  
  if (lower.includes("proposal")) {
    tasks.push({
      title: "Send Proposal",
      owner: "Sales Rep",
      dueDate: "Tomorrow"
    });
  }
  if (lower.includes("demo")) {
    tasks.push({
      title: "Arrange Demo",
      owner: "Sales Rep",
      dueDate: "Next Week"
    });
  }
  if (lower.includes("contract")) {
    tasks.push({
      title: "Review Contract",
      owner: "Legal",
      dueDate: "ASAP"
    });
  }

  if (tasks.length === 0) {
    tasks.push({ title: "General Follow Up", owner: "Sales Rep", dueDate: "Tomorrow" });
  }

  // Save to DB
  try {
    for (const t of tasks) {
      await prisma.salesTask.create({
        data: {
          title: t.title,
          owner: t.owner,
          dueDate: t.dueDate,
          // Only link leadId if it exists, but to be safe we skip DB save if it fails
          leadId
        }
      });
    }
  } catch (e) {
    console.log("Mock leadId not found, skipping task DB save");
  }

  return { leadId, tasks };
};

exports.recommendations = async (leadId) => {
  // Provide Next Best Action based on lead ID pattern or randomly
  const stages = ["Early Deal", "Mid Deal", "Late Deal"];
  const actions = {
    "Early Deal": { action: "Schedule Product Demo", context: "Lead has shown initial interest but hasn't seen the product." },
    "Mid Deal": { action: "Share Proposal", context: "Technical requirements gathered. Ready for pricing." },
    "Late Deal": { action: "Contract Review Meeting", context: "Verbal agreement reached. Need to finalize terms." }
  };
  
  // Pick one deterministically based on leadId length
  const stage = stages[leadId.length % 3] || "Mid Deal";
  const rec = actions[stage];

  try {
    await prisma.followUpRecommendation.create({
      data: {
        leadId,
        recommendation: JSON.stringify({ stage, ...rec })
      }
    });
  } catch (e) {
    console.log("Mock leadId not found, skipping recommendation DB save");
  }

  return {
    leadId,
    dealStage: stage,
    recommendedAction: rec.action,
    reasoning: rec.context
  };
};

exports.generateEmail = async (leadId, transcript, recipientName) => {
  const insights = await this.analyzeTranscript(transcript);
  
  const subject = "Follow-up on Today's Discussion";
  
  const bulletPoints = [];
  if (insights.requirements.length > 0) bulletPoints.push(...insights.requirements);
  if (insights.objections.includes("Cost concerns")) bulletPoints.push("Enterprise Pricing Options");
  if (insights.objections.includes("Implementation timeline")) bulletPoints.push("Implementation Timeline");
  
  const nextSteps = insights.nextSteps.map(s => `• ${s}`).join('\n');
  const discussed = bulletPoints.map(s => `• ${s}`).join('\n');

  const body = `Hi ${recipientName || 'there'},

Thank you for your time today.

As discussed:
${discussed || '• Review of your CRM requirements'}

Next Steps:
${nextSteps || '• Follow up call next week'}

Regards,
Sales Team`;

  try {
    await prisma.generatedEmail.create({
      data: {
        leadId,
        subject,
        body
      }
    });
  } catch (e) {
    console.log("Mock leadId not found, skipping email DB save");
  }

  return {
    leadId,
    subject,
    body
  };
};
