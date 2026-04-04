const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  symptoms: [{
    type: String
  }],
  note: {
    type: String,
    maxlength: 1000
  },
  lifestyle: {
    exercise: {
      type: String,
      enum: ['', 'None', 'Light walk', 'Yoga', 'Cardio', 'Strength training']
    },
    sleep: {
      type: String,
      enum: ['', '< 5 hrs', '5-6 hrs', '7-8 hrs', '> 8 hrs']
    },
    stress: {
      type: String,
      enum: ['', 'Very low', 'Low', 'Moderate', 'High', 'Very high']
    },
    meals: {
      type: String,
      maxlength: 500
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);