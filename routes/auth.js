const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin._id, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: route to create default admin if not exists (run once)
router.post('/setup', async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) return res.json({ message: 'Admin already exists' });
    
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });
    await admin.save();
    res.json({ message: 'Default admin created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;