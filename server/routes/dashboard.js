const express = require('express');
const jwt = require('jsonwebtoken');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const Medication = require('../models/Medication');
const DoctorVisit = require('../models/DoctorVisit');
const OpenAI = require('openai');

const router = express.Router();

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

const openai = process.env.OPENROUTER_API_KEY ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "CycleCare Dashboard",
  },
}) : null;

// Get aggregated dashboard data
router.get('/data', auth, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.userId }).sort({ startDate: -1 });
    const dailyLogs = await DailyLog.find({ user: req.userId }).sort({ date: -1 }).limit(30);
    const medications = await Medication.find({ user: req.userId });
    const visits = await DoctorVisit.find({ user: req.userId });

    // Calculate cycle statistics
    const cycleLengths = [];
    const periodLengths = [];
    
    for (let i = 1; i < cycles.length; i++) {
      const daysBetween = Math.round((cycles[i-1].startDate - cycles[i].startDate) / (1000 * 60 * 60 * 24));
      if (daysBetween > 0 && daysBetween < 60) cycleLengths.push(daysBetween);
    }
    
    cycles.forEach(c => {
      if (c.periodLen) periodLengths.push(c.periodLen);
    });

    // Flow distribution
    const flowDistribution = { light: 0, medium: 0, heavy: 0, spotting: 0 };
    cycles.forEach(c => {
      if (c.flowType && flowDistribution.hasOwnProperty(c.flowType)) {
        flowDistribution[c.flowType]++;
      }
    });

    // Symptom frequency (last 30 logs)
    const symptomCounts = {};
    dailyLogs.forEach(log => {
      if (log.symptoms) {
        log.symptoms.forEach(s => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
      }
    });

    // Lifestyle averages
    const sleepCounts = { '< 5 hrs': 0, '5-6 hrs': 0, '7-8 hrs': 0, '> 8 hrs': 0 };
    const stressCounts = { 'Very low': 0, 'Low': 0, 'Moderate': 0, 'High': 0, 'Very high': 0 };
    const exerciseCounts = { 'None': 0, 'Light walk': 0, 'Yoga': 0, 'Cardio': 0, 'Strength training': 0 };
    
    dailyLogs.forEach(log => {
      if (log.lifestyle) {
        if (log.lifestyle.sleep) sleepCounts[log.lifestyle.sleep] = (sleepCounts[log.lifestyle.sleep] || 0) + 1;
        if (log.lifestyle.stress) stressCounts[log.lifestyle.stress] = (stressCounts[log.lifestyle.stress] || 0) + 1;
        if (log.lifestyle.exercise) exerciseCounts[log.lifestyle.exercise] = (exerciseCounts[log.lifestyle.exercise] || 0) + 1;
      }
    });

    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) 
      : null;
    
    const avgPeriodLength = periodLengths.length > 0 
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length) 
      : null;

    res.json({
      success: true,
      data: {
        stats: {
          totalCycles: cycles.length,
          avgCycleLength,
          avgPeriodLength,
          currentCycleLength: cycleLengths[0] || null,
        },
        cycles: cycles.slice(0, 12).map(c => ({
          startDate: c.startDate,
          endDate: c.endDate,
          flowType: c.flowType,
          periodLen: c.periodLen,
        })),
        flowDistribution,
        symptomCounts: Object.entries(symptomCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
        lifestyle: {
          sleep: sleepCounts,
          stress: stressCounts,
          exercise: exerciseCounts,
        },
        medications: medications.length,
        doctorVisits: visits.length,
        lastPeriod: cycles[0]?.startDate || null,
        logsCount: dailyLogs.length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Insights endpoint
router.get('/insights', auth, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.userId }).sort({ startDate: -1 }).limit(6);
    const dailyLogs = await DailyLog.find({ user: req.userId }).sort({ date: -1 }).limit(14);

    if (cycles.length < 2) {
      return res.json({
        success: true,
        data: {
          insights: [
            { type: 'info', title: 'Track More Cycles', message: 'Log at least 2 cycles to get personalized insights and predictions.' }
          ],
          prediction: null,
        }
      });
    }

    // Calculate cycle stats for AI
    const cycleLengths = [];
    for (let i = 1; i < cycles.length; i++) {
      const days = Math.round((cycles[i-1].startDate - cycles[i].startDate) / (1000 * 60 * 60 * 24));
      if (days > 0 && days < 60) cycleLengths.push(days);
    }
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) 
      : 28;

    // Get last period start
    const lastPeriodStart = new Date(cycles[0].startDate);
    const nextPeriodDate = new Date(lastPeriodStart);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);

    // Common symptoms from logs
    const allSymptoms = [];
    dailyLogs.forEach(log => {
      if (log.symptoms) allSymptoms.push(...log.symptoms);
    });
    const topSymptoms = [...new Set(allSymptoms)].slice(0, 5).join(', ');

    // AI-generated insights
    if (openai && process.env.OPENROUTER_API_KEY) {
      try {
        const prompt = `You are a menstrual health expert AI assistant. Based on the following user data:
- Average cycle length: ${avgCycleLength} days
- Last period started: ${lastPeriodStart.toDateString()}
- Top symptoms tracked: ${topSymptoms || 'None'}
- Total cycles logged: ${cycles.length}

Provide:
1. A prediction of next period date (if predictable)
2. 3-4 actionable health insights about their cycle patterns
3. Any pattern warnings if cycles seem irregular

Keep responses concise, supportive, and medically appropriate. Format as JSON with keys: prediction, insights (array with type, title, message), recommendation.`;

        const completion = await openai.chat.completions.create(
          {
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
          },
          { timeout: 15000 }
        );

        const aiResponse = completion.choices[0].message.content;
        let parsed;
        try {
          parsed = JSON.parse(aiResponse);
        } catch {
          parsed = { insights: [{ type: 'info', title: 'Health Update', message: aiResponse }], prediction: null };
        }

        return res.json({
          success: true,
          data: {
            prediction: nextPeriodDate.toISOString(),
            avgCycleLength,
            ...parsed,
          }
        });
      } catch (aiError) {
        console.error('AI Insights Error:', aiError.message);
      }
    }

    // Fallback insights without AI
    const daysUntilNext = Math.round((nextPeriodDate - new Date()) / (1000 * 60 * 60 * 24));
    
    const insights = [];
    
    if (avgCycleLength >= 25 && avgCycleLength <= 35) {
      insights.push({ type: 'success', title: 'Regular Cycle', message: `Your cycles are regular at ${avgCycleLength} days. Great job tracking!` });
    } else if (avgCycleLength > 0) {
      insights.push({ type: 'warning', title: 'Irregular Cycles', message: `Your cycle length varies (avg ${avgCycleLength} days). Consider noting any triggers.` });
    }

    if (daysUntilNext > 0 && daysUntilNext <= 14) {
      insights.push({ type: 'info', title: 'Next Period', message: `Expected in ${daysUntilNext} days based on your patterns.` });
    }

    if (topSymptoms) {
      insights.push({ type: 'tip', title: 'Symptom Pattern', message: `You often experience: ${topSymptoms}. This is common and manageable.` });
    }

    if (cycles[0].flowType === 'heavy') {
      insights.push({ type: 'tip', title: 'Flow Tip', message: 'Heavy flow days? Stay hydrated and consider iron-rich foods.' });
    }

    res.json({
      success: true,
      data: {
        prediction: nextPeriodDate.toISOString(),
        avgCycleLength,
        insights,
        recommendation: 'Keep tracking daily to improve prediction accuracy.',
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;