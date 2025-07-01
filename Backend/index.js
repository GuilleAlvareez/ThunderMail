import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: "guillealvarezmoreno2@gmail.com",
      to: email,
      subject: name,
      text: message
    });
    
    res.send('Email sent');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to send email');
  }

});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});