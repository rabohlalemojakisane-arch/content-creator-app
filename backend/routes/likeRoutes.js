const express = require('express');
const router = express.Router();
const Like = require('../models/Like');

router.post('/', async (req, res) => {
  try {
    const { contentId, viewerId } = req.body;
    
    const existingLike = await Like.findOne({ contentId, viewerId });
    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ message: 'Unliked' });
    }

    const newLike = new Like({ contentId, viewerId });
    await newLike.save();
    res.status(201).json({ message: 'Liked' });
  } catch (error) {
    res.status(400).json({ message: 'Like failed' });
  }
});

router.get('/:contentId', async (req, res) => {
  try {
    const likes = await Like.countDocuments({ contentId: req.params.contentId });
    res.json({ count: likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;