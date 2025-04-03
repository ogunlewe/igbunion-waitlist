
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'igbogbounion-waitlist.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

app.post('/api/send-welcome', async (req, res) => {
  const { email } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Igbogbo Student Union!',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Welcome to Igbogbo Student Union!</h1>
        <p>Thank you for joining our waitlist. We'll keep you updated about our launch!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-announcement', async (req, res) => {
  const { emails, subject, message } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    bcc: emails,
    subject: subject,
    html: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove or update the app.listen() call as Vercel handles this
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

// Export the Express API
module.exports = app;