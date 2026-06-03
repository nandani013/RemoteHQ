const salesAutomationService = require('../services/salesAutomation.service');

// Pre-Call Summary Generation
exports.preCallSummary = async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: 'leadId is required' });
    const result = await salesAutomationService.preCallSummary(leadId);
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('sales_automation_notification', {
        type: 'pre_call_summary',
        message: `New Pre-Call Summary generated for Lead ${leadId}`,
        data: result
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analyze Transcript (Conversation Intelligence)
exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'transcript is required' });
    const result = await salesAutomationService.analyzeTranscript(transcript);
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('sales_automation_notification', {
        type: 'conversation_insight',
        message: 'New Conversation Insights extracted from transcript',
        data: result
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Automated Task Creation
exports.createTasks = async (req, res) => {
  try {
    const { leadId, transcript } = req.body;
    if (!leadId || !transcript) return res.status(400).json({ error: 'leadId and transcript required' });
    const result = await salesAutomationService.createTasks(leadId, transcript);
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('sales_automation_notification', {
        type: 'task_automation',
        message: `New automated tasks created for Lead ${leadId}`,
        data: result
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Recommendations (Next Best Action)
exports.recommendations = async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: 'leadId is required' });
    const result = await salesAutomationService.recommendations(leadId);
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('sales_automation_notification', {
        type: 'recommendation',
        message: `New Next Best Action recommendation for Lead ${leadId}`,
        data: result
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Email Draft
exports.generateEmail = async (req, res) => {
  try {
    const { leadId, transcript, recipientName } = req.body;
    if (!leadId || !transcript) return res.status(400).json({ error: 'leadId and transcript required' });
    const result = await salesAutomationService.generateEmail(leadId, transcript, recipientName);
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('sales_automation_notification', {
        type: 'email_generator',
        message: `New email draft generated for ${recipientName || 'Lead ' + leadId}`,
        data: result
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
