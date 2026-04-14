const cron = require('node-cron');
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const { sendPeriodReminder } = require('../utils/emailService');

// Helper: calculate next period start date
const calculateNextPeriod = (cycles, avgCycleLength) => {
  if (!cycles.length) return null;
  const lastCycle = cycles.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  const lastStart = new Date(lastCycle.startDate);
  const nextPeriodStart = new Date(lastStart);
  nextPeriodStart.setDate(lastStart.getDate() + avgCycleLength);
  return nextPeriodStart;
};

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔄 Running period reminder check...');

  try {
    const users = await User.find({ role: 'women', isVerified: true });

    for (const user of users) {
      const cycles = await Cycle.find({ user: user._id }).sort({ startDate: -1 });
      if (cycles.length === 0) continue;

      // Calculate average cycle length from user's history
      const cycleLengths = [];
      for (let i = 0; i < cycles.length - 1; i++) {
        const diff = (new Date(cycles[i].startDate) - new Date(cycles[i + 1].startDate)) / (1000 * 60 * 60 * 24);
        if (diff >= 15 && diff <= 60) cycleLengths.push(diff);
      }
      const avgCycle = cycleLengths.length
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : 28;

      const nextPeriod = calculateNextPeriod(cycles, avgCycle);
      if (!nextPeriod) continue;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

      if (daysUntil === 1 || daysUntil === 2 || daysUntil === 3) {
        await sendPeriodReminder(user.email, user.name || user.email.split('@')[0], daysUntil);
      }
    }

    console.log('✅ Period reminder check completed');
  } catch (error) {
    console.error('❌ Error in period reminder job:', error);
  }
});