const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  contentType: { type: String, required: true },
  thumbnail: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Draft' },
  publicationDate: { type: Date },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);