const Issue = require('../models/Issue');

// Get all issues with filtering (admin only)
exports.getAllIssues = async (req, res) => {
  try {
    const { status, search, category, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { areaLocality: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Issue.countDocuments(filter);
    
    res.json({ 
      issues, 
      total, 
      page: Number(page), 
      pages: Math.ceil(total / limit),
      pending: await Issue.countDocuments({ status: 'pending' }),
      approved: await Issue.countDocuments({ status: 'approved' })
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve an issue
exports.approveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    
    issue.status = 'approved';
    await issue.save();
    res.json({ message: 'Issue approved', issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject an issue
exports.rejectIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    
    issue.status = 'rejected';
    await issue.save();
    res.json({ message: 'Issue rejected', issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get statistics (optional)
exports.getStats = async (req, res) => {
  try {
    const pending = await Issue.countDocuments({ status: 'pending' });
    const approved = await Issue.countDocuments({ status: 'approved' });
    const total = await Issue.countDocuments();
    res.json({ pending, approved, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};