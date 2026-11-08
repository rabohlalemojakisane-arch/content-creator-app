const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const contents = await Content.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content) {
      content.views += 1;
      await content.save();
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid content data', error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContent);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;