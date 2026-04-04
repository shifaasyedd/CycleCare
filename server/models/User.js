const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    name: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
    default: null
  },
  googleId: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['men', 'girls', 'women'],
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Email verification fields
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function () {
  if (!this.password) return;
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.verificationTokenExpiry;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);