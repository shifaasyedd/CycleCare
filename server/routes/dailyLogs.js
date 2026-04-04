const express = require('express');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

// @route   GET /api/daily-logs
router.get('/', async (req, res) => {
  try {
    const logs = await DailyLog.find().sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   POST /api/daily-logs
router.post('/', async (req, res) => {
  try {
    const log = await DailyLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;