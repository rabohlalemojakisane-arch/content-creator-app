const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
  try {
    const totalContent = await Content.countDocuments();
    const published = await Content.countDocuments({ status: 'Published' });
    const drafts = await Content.countDocuments({ status: 'Draft' });
    const scheduled = await Content.countDocuments({ status: 'Scheduled' });
    const comments = await Comment.countDocuments();

    res.json({
      totalContent,
      published,
      drafts,
      scheduled,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;