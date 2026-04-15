const cron = require('node-cron');
const Cycle = require('../models/Cycle');
const User = require('../models/User');
const { sendPeriodReminder } = require('./emailService');

const initCronJobs = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('--- Checking for upcoming periods (predicted) ---');
    try {
      // Only send reminders to menstruators (women/girls roles)
      const usersWithCycles = await Cycle.distinct('user');

      for (const userId of usersWithCycles) {
        const user = await User.findById(userId);
        if (!user || !user.email) continue;
        if (!['women', 'girls'].includes(user.role)) continue;

        // Get user's cycles sorted by startDate descending
        const cycles = await Cycle.find({ user: userId }).sort({ startDate: -1 });
        if (cycles.length === 0) continue;

        const latestCycle = cycles[0];
        if (!latestCycle.startDate) continue;

        // Calculate average cycle length
        let avgCycleLength = 28;
        if (cycles.length > 1) {
          let totalLength = 0;
          let validIntervals = 0;
          for (let i = 0; i < cycles.length - 1; i++) {
            const diff = (cycles[i].startDate - cycles[i + 1].startDate) / (1000 * 60 * 60 * 24);
            if (diff >= 15 && diff <= 60) { totalLength += diff; validIntervals++; }
          }
          if (validIntervals > 0) avgCycleLength = Math.round(totalLength / validIntervals);
        }

        const nextPeriodStart = new Date(latestCycle.startDate);
        nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((nextPeriodStart - today) / (1000 * 60 * 60 * 24));

        if (daysUntil === 1 || daysUntil === 2 || daysUntil === 3) {
          await sendPeriodReminder(user.email, user.name || user.email.split('@')[0], daysUntil);
          console.log(`✅ Reminder sent to ${user.email} (${daysUntil} days)`);
        }
      }
      
      console.log('✅ Period reminder check completed');
    } catch (error) {
      console.error('❌ Error in Period Reminder Cron:', error);
    }
  });

  console.log('⏰ Period reminder cron job initialized (runs daily at 9 AM)');
};

module.exports = initCronJobs;