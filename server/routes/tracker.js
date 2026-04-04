const express = require('express');
const jwt = require('jsonwebtoken');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const Medication = require('../models/Medication');
const DoctorVisit = require('../models/DoctorVisit');

const router = express.Router();

// Middleware to authenticate user
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// ========== CYCLES ==========
// Get all cycles for logged-in user
router.get('/cycles', auth, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.userId }).sort({ startDate: -1 });
    res.json({ success: true, data: cycles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a new cycle
router.post('/cycles', auth, async (req, res) => {
  try {
    const cycle = new Cycle({ ...req.body, user: req.userId });
    await cycle.save();
    res.json({ success: true, data: cycle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a cycle
router.delete('/cycles/:id', auth, async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!cycle) return res.status(404).json({ success: false, error: 'Cycle not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========== DAILY LOGS ==========
// Get all daily logs
router.get('/daily-logs', auth, async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a daily log
router.post('/daily-logs', auth, async (req, res) => {
  try {
    const log = new DailyLog({ ...req.body, user: req.userId });
    await log.save();
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update a daily log
router.put('/daily-logs/:date', auth, async (req, res) => {
  try {
    const log = await DailyLog.findOneAndUpdate(
      { user: req.userId, date: req.params.date },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========== MEDICATIONS ==========
// Get all medications
router.get('/medications', auth, async (req, res) => {
  try {
    const meds = await Medication.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: meds });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a medication
router.post('/medications', auth, async (req, res) => {
  try {
    const med = new Medication({ ...req.body, user: req.userId });
    await med.save();
    res.json({ success: true, data: med });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a medication
router.delete('/medications/:id', auth, async (req, res) => {
  try {
    const med = await Medication.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!med) return res.status(404).json({ success: false, error: 'Medication not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========== DOCTOR VISITS ==========
// Get all doctor visits
router.get('/visits', auth, async (req, res) => {
  try {
    const visits = await DoctorVisit.find({ user: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a doctor visit
router.post('/visits', auth, async (req, res) => {
  try {
    const visit = new DoctorVisit({ ...req.body, user: req.userId });
    await visit.save();
    res.json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a doctor visit
router.delete('/visits/:id', auth, async (req, res) => {
  try {
    const visit = await DoctorVisit.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!visit) return res.status(404).json({ success: false, error: 'Visit not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;