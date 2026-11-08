const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  displayName: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Hidden'], default: 'Approved' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);