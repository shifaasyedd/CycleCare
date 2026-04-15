const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const DoctorVisit = require('../models/DoctorVisit');
const Medication = require('../models/Medication');
const Message = require('../models/Message');
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
    // Debug: Get all roles distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    console.log('Role distribution:', roleDistribution);
    
    // Core user stats
    const [totalUsers, men, girls, women, notSelected] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'men' }),
      User.countDocuments({ role: 'girls' }),
      User.countDocuments({ role: 'women' }),
      User.countDocuments({ role: 'not_selected' }),
    ]);

    console.log('Role counts - Men:', men, 'Girls:', girls, 'Women:', women, 'NotSelected:', notSelected);

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const [activeToday, activeThisWeek, activeThisMonth] = await Promise.all([
      User.countDocuments({ lastActive: { $gte: todayStart } }),
      User.countDocuments({ lastActive: { $gte: weekAgo } }),
      User.countDocuments({ lastActive: { $gte: monthAgo } }),
    ]);

    // Feature usage counts
    const [totalCycles, totalLogs, totalMessages, totalVisits, totalMedications] = await Promise.all([
      Cycle.countDocuments(),
      DailyLog.countDocuments(),
      Message.countDocuments(),
      DoctorVisit.countDocuments(),
      Medication.countDocuments(),
    ]);

    // Flow type breakdown
    const flowBreakdown = await Cycle.aggregate([
      { $group: { _id: '$flowType', count: { $sum: 1 } } },
    ]);

    // Top symptoms (flatten all symptoms arrays, count occurrences)
    const symptomsAgg = await DailyLog.aggregate([
      { $unwind: '$symptoms' },
      { $group: { _id: '$symptoms', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Stress level distribution
    const stressAgg = await DailyLog.aggregate([
      { $match: { 'lifestyle.stress': { $exists: true, $ne: '' } } },
      { $group: { _id: '$lifestyle.stress', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Sleep distribution
    const sleepAgg = await DailyLog.aggregate([
      { $match: { 'lifestyle.sleep': { $exists: true, $ne: '' } } },
      { $group: { _id: '$lifestyle.sleep', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Last 7 days active users
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

    // Signup growth — last 30 days
    const signupGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0,0,0,0);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const count = await User.countDocuments({ createdAt: { $gte: day, $lt: nextDay } });
      signupGrowth.push({ date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count });
    }

    // Chatbot usage — last 14 days
    const chatUsage = [];
    for (let i = 13; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0,0,0,0);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const count = await Message.countDocuments({ createdAt: { $gte: day, $lt: nextDay } });
      chatUsage.push({ date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count });
    }

    // Average cycle length
    const avgCycleAgg = await Cycle.aggregate([
      { $match: { periodLen: { $exists: true, $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$periodLen' } } },
    ]);
    const avgCycleLength = avgCycleAgg.length ? Math.round(avgCycleAgg[0].avg * 10) / 10 : 0;

    res.json({
      success: true,
      stats: {
        totalUsers, men, girls, women,
        activeToday, activeThisWeek, activeThisMonth,
        totalCycles, totalLogs, totalMessages, totalVisits, totalMedications,
        avgCycleLength,
      },
      activity: last7Days,
      signupGrowth,
      chatUsage,
      flowBreakdown: flowBreakdown.map(f => ({ name: f._id || 'unknown', count: f.count })),
      topSymptoms: symptomsAgg.map(s => ({ name: s._id, count: s.count })),
      stressLevels: stressAgg.map(s => ({ name: s._id, count: s.count })),
      sleepPatterns: sleepAgg.map(s => ({ name: s._id, count: s.count })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;