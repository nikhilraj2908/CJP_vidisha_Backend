const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllIssues, approveIssue, rejectIssue, getStats } = require('../controllers/adminController');

router.use(auth); // all routes below require token

router.get('/issues', getAllIssues);
router.put('/issues/:id/approve', approveIssue);
router.put('/issues/:id/reject', rejectIssue);
router.get('/stats', getStats);

module.exports = router;