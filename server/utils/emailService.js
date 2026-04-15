const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Welcome email sent after registration
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"CycleCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to CycleCare!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9FB; border-radius: 16px;">
        <h2 style="color: #E54C6F;">Hi ${name}, welcome to CycleCare! 💜</h2>
        <p>Your account has been created successfully. We're here to support your journey.</p>
        <p>You can now:</p>
        <ul>
          <li>Choose a Role-Based Journey</li>
          <li>Educational content & support guides</li>
          <li>Track Health Data (Cycles, Symptoms, Lifestyle, Medications, Doctor Visits)</li>
          <li>Get AI-Powered Insights & Chat Support</li>
          <li>Participate in Community & Admin Oversight</li>
        </ul>
        <a href="https://thecyclecare.vercel.app/category" style="display: inline-block; padding: 10px 20px; background-color: #E54C6F; color: white; text-decoration: none; border-radius: 25px;">Go to Dashboard</a>
        <hr style="margin: 20px 0; border-color: #FFD4DF;" />
        <p style="font-size: 12px; color: #999;">CycleCare – For Those Who Experience & Care</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error("❌ Welcome email error:", err);
  }
};

// 🌸 Period reminder email (2 days before expected period)
const sendPeriodReminder = async (email, name, daysUntil) => {
  const mailOptions = {
    from: `"CycleCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🌸 Your period is approaching in ${daysUntil} days!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9FB; border-radius: 16px;">
        <h2 style="color: #E54C6F;">Hello ${name}!</h2>
        <p>We noticed your period is expected to start in <strong>${daysUntil} days</strong>.</p>
        <p>Here are some tips to help you prepare:</p>
        <ul>
          <li>🩸 Keep period products handy</li>
          <li>🔥 Have a heating pad ready for cramps</li>
          <li>🍫 Stock up on your favorite snacks</li>
          <li>💧 Stay hydrated</li>
        </ul>
        <a href="https://thecyclecare.vercel.app/tracker" style="display: inline-block; padding: 10px 20px; background-color: #E54C6F; color: white; text-decoration: none; border-radius: 25px;">Go to Tracker</a>
        <hr style="margin: 20px 0; border-color: #FFD4DF;" />
        <p style="font-size: 12px; color: #999;">CycleCare – For Those Who Experience & Care</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Period reminder sent to ${email}`);
  } catch (err) {
    console.error("❌ Period reminder error:", err);
  }
};

module.exports = { sendWelcomeEmail, sendPeriodReminder };