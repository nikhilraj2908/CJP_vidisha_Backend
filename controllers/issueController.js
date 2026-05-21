const Issue = require('../models/Issue');

// Submit a new issue (public)
exports.submitIssue = async (req, res) => {
  try {
    const { name, areaLocality, category, title, description, anonymous, wardNo, emailOrPhone } = req.body;
    
    // Validate required fields
    if (!areaLocality || !category || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const issue = new Issue({
      name: anonymous ? '' : (name || ''),
      areaLocality,
      category,
      title,
      description,
      imageUrl,
      anonymous: anonymous === 'true' || anonymous === true,
      wardNo: wardNo || '',
      emailOrPhone: emailOrPhone || '',
      status: 'pending'
    });

    await issue.save();
    res.status(201).json({ message: 'Issue submitted successfully (pending approval)', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get approved issues (for public feed)
exports.getApprovedIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const issues = await Issue.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Issue.countDocuments({ status: 'approved' });
    res.json({ issues, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single approved issue (public)
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || issue.status !== 'approved') {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};