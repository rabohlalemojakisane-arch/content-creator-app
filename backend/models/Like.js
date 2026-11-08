const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  viewerId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Like', likeSchema);