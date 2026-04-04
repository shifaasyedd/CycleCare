require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"CycleCare Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // sends to yourself
      subject: '✅ CycleCare Email Test',
      text: 'If you received this, your email setup is working perfectly!',
      html: '<h2>✅ Email Test Successful!</h2><p>Your CycleCare email configuration is working correctly.</p>',
    });

    console.log('✅ Email sent! Message ID:', info.messageId);
    console.log(`📬 Check your inbox at ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure you enabled 2-Step Verification on your Google account.');
      console.log('2. Generate an App Password at https://myaccount.google.com/apppasswords');
      console.log('3. Update EMAIL_PASS in your .env file with the 16-character password.');
    }
  }
}

testEmail();