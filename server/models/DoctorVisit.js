const mongoose = require('mongoose');

const doctorVisitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a visit date']
  },
  doctor: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  tests: {
    type: String,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DoctorVisit', doctorVisitSchema);