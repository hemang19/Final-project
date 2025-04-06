const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/send-invite', async (req, res) => {
  const { to, taskName, description, from } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // yourapp@gmail.com
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: `"${from}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${from} wants to assign you a task`,
      html: `
        <h2>Task Invitation</h2>
        <p><strong>${from}</strong> wants you to work on a task:</p>
        <p><strong>Task:</strong> ${taskName}</p>
        <p><strong>Description:</strong> ${description}</p>
        <br/>
        <a href="#">✅ Accept</a> &nbsp; | &nbsp; <a href="#">❌ Decline</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).send({ error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
