const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = 'shifashoebsyed@gmail.com';
const ADMIN_PASSWORD = 'Shifa@123';
const ADMIN_EMAILS = [ADMIN_EMAIL];
const isAdminUser = (user) =>
  !!user && (user.isAdmin === true || ADMIN_EMAILS.includes((user.email || '').toLowerCase()));

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

// POST /api/admin/login — hardcoded admin login, auto-creates user if needed
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    // Find or create the admin user in the database
    let user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      user = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        isAdmin: true,
        isVerified: true,
      });
    } else if (!user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!isAdminUser(user)) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/verify
router.get('/verify', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ isAdmin: isAdminUser(user) });
  } catch (err) {
    res.status(500).json({ isAdmin: false });
  }
});

// GET /api/admin/users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const cyclesCount = await Cycle.countDocuments({ user: user._id });
      const logsCount = await DailyLog.countDocuments({ user: user._id });
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'not_selected',
        createdAt: user.createdAt,
        lastActive: user.lastActive || user.createdAt,
        cyclesTracked: cyclesCount,
        logsCount: logsCount,
        isAdmin: user.isAdmin || false
      };
    }));
    res.json({ success: true, users: usersWithStats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const men = await User.countDocuments({ role: 'men' });
    const girls = await User.countDocuments({ role: 'girls' });
    const women = await User.countDocuments({ role: 'women' });
    
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const activeToday = await User.countDocuments({ lastActive: { $gte: todayStart } });
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeThisWeek = await User.countDocuments({ lastActive: { $gte: weekAgo } });
    
    // Last 7 days activity
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0,0,0,0);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const count = await User.countDocuments({ lastActive: { $gte: day, $lt: nextDay } });
      last7Days.push({ date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count });
    }
    
    res.json({ success: true, stats: { totalUsers, men, girls, women, activeToday, activeThisWeek }, activity: last7Days });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;