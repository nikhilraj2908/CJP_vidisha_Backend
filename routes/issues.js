const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { submitIssue, getApprovedIssues, getIssueById ,supportIssue} = require('../controllers/issueController');

router.post('/', upload.single('image'), submitIssue);
router.get('/', getApprovedIssues);
router.get('/:id', getIssueById);
router.put('/:id/support', supportIssue);
module.exports = router;