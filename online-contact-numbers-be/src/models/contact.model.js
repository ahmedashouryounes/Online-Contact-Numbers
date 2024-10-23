const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: String,
  notes: String,
  lockedBy: { 
    type: String, 
    default: null 
  },
  lockedAt: { 
    type: Date, 
    default: null 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);