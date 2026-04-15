const emailjs = require('@emailjs/nodejs');

const SERVICE_ID = 'service_e4x92gt';
const WELCOME_TEMPLATE_ID = 'template_0fpnwyc';
const REMINDER_TEMPLATE_ID = 'template_ti9fm0q';
const PUBLIC_KEY = 'JQCFmJ6Bw_B6xvt8l';
const PRIVATE_KEY = 'ti3NBkNand-dkEEgWZQ46';

const sendWelcomeEmail = async (email, name) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      WELCOME_TEMPLATE_ID,
      { to_name: name, to_email: email },
      { publicKey: PUBLIC_KEY, privateKey: PRIVATE_KEY }
    );
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error('❌ Welcome email error:', err?.text || err?.message || err);
  }
};

const sendPeriodReminder = async (email, name, daysUntil) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      REMINDER_TEMPLATE_ID,
      { to_name: name, to_email: email, days_until: daysUntil },
      { publicKey: PUBLIC_KEY, privateKey: PRIVATE_KEY }
    );
    console.log(`✅ Period reminder sent to ${email}`);
  } catch (err) {
    console.error('❌ Period reminder error:', err?.text || err?.message || err);
  }
};

module.exports = { sendWelcomeEmail, sendPeriodReminder };
