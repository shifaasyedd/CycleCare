const cron = require('node-cron');
const Cycle = require('../models/Cycle'); // [cite: 1]
const User = require('../models/User'); 
const { sendPeriodReminder } = require('./emailService');

const initCronJobs = () => {
  // Runs every day at 09:00 AM
// Inside cronJobs.js
cron.schedule('0 9 * * *', async () => {
    console.log('--- Checking for upcoming periods ---');
    try {
        const today = new Date();
        // Set target to exactly 2 days from now
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + 2);
        
        // Create a range for the WHOLE day of the target
        const startOfTargetDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfTargetDay = new Date(targetDate.setHours(23, 59, 59, 999));

        console.log(`Searching for cycles between: ${startOfTargetDay} and ${endOfTargetDay}`);

        const upcomingCycles = await Cycle.find({
            startDate: {
                $gte: startOfTargetDay,
                $lte: endOfTargetDay
            }
        }).populate('user'); // Crucial: This links the cycle to the user email [cite: 20, 108]

        console.log(`Found ${upcomingCycles.length} matching cycles.`);

        for (const cycle of upcomingCycles) {
            // Check if the user object exists and has an email
            if (cycle.user && cycle.user.email) {
                await sendPeriodReminder(cycle.user.email, cycle.user.name, 2);
            } else {
                console.log(`⚠️ No user email found for cycle: ${cycle._id}`);
            }
        }
        
        console.log('✅ Period reminder check completed');
        console.log(`--- Finished: ${upcomingCycles.length} reminders processed ---`);
    } catch (error) {
        console.error('❌ Error in Period Reminder Cron:', error);
    }
});
}
module.exports = initCronJobs;