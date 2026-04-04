const express = require('express');
const Cycle = require('../models/Cycle');

const router = express.Router();

// @route   GET /api/cycles
router.get('/', async (req, res) => {
  try {
    const cycles = await Cycle.find().sort({ start: -1 });
    res.json({ success: true, data: cycles });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   POST /api/cycles
router.post('/', async (req, res) => {
  try {
    const cycle = await Cycle.create(req.body);
    res.status(201).json({ success: true, data: cycle });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;