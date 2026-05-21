const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  areaLocality: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  anonymous: { type: Boolean, default: false },
  wardNo: { type: String, default: '' },
  emailOrPhone: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);