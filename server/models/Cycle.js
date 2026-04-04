const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date
  },
  flowType: {
    type: String,
    enum: ['light', 'medium', 'heavy', 'spotting', 'none'],
    default: 'medium'
  },
  periodLen: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cycle', cycleSchema);