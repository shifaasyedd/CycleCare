const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verificationLink = `https://cyclecare-j2yz.onrender.com/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"CycleCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your CycleCare account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9FB; border-radius: 16px;">
        <h2 style="color: #E54C6F;">Welcome to CycleCare, ${name}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #E54C6F; color: white; text-decoration: none; border-radius: 25px;">Verify Email</a>
        <p>This link expires in <strong>24 hours</strong>.</p>
        <p>If you didn't create an account, you can ignore this email.</p>
        <hr style="margin: 20px 0; border-color: #FFD4DF;" />
        <p style="font-size: 12px; color: #999;">CycleCare – For Those Who Experience & Care</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error("❌ Nodemailer Error:", err);
  }
};

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
    console.error("❌ Reminder Error:", err);
  }
};

module.exports = { sendVerificationEmail, sendPeriodReminder };