const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendAcceptedEmail = async (toEmail, learnerName, teacherName, topic) => {
  await transporter.sendMail({
    from: `"5Min" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Someone's ready to teach you!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FDE8D8;border-radius:16px;">
        <h1 style="font-size:28px;margin-bottom:8px;">You've got a teacher!</h1>
        <p style="color:#555;margin-bottom:24px;">Hey ${learnerName},</p>
        <p><strong>${teacherName}</strong> just accepted your request:</p>
        <div style="background:#fff;border:2px solid #111;border-radius:12px;padding:16px;margin:16px 0;">
          <strong>${topic}</strong>
        </div>
        <p style="color:#555;">Head back to 5Min to join your session before the timer starts!</p>
        <a href="${process.env.FRONTEND_URL}/feed"
          style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;border-radius:20px;text-decoration:none;font-weight:600;">
          Join session →
        </a>
        <p style="color:#aaa;font-size:12px;margin-top:24px;">You're receiving this because you posted a request on 5Min.</p>
      </div>
    `
  });
};

module.exports = { sendAcceptedEmail };