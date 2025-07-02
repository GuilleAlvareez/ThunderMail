import express from 'express';
import dotenv from 'dotenv';
import { pool } from './utils/config.js';
import { separateInfo } from './utils/methods.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './utils/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import cors from 'cors';
import { corsOptions, transporter } from './utils/constant.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.all('/api/auth/*', toNodeHandler(auth.handler));
app.use(express.json());

app.post('/logout', async (req, res) => {
  try {
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true
    })

    // Aplicar las cabeceras Set-Cookie de la respuesta de Better Auth a la respuesta de Express
    const setCookieHeaders = response.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      res.setHeader('Set-Cookie', setCookieHeaders)
    }

    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
  }
})

app.post('/chat/send-email', async (req, res) => {
  const { to, subject, content } = req.body;

  try {
    await transporter.sendMail({
      from: "guillealvarezmoreno2@gmail.com",
      to: to,
      subject: subject,
      text: content
    });
    
    res.send('Email sent');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to send email');
  }

});

app.post('/chat/createText', async (req, res) => {
  const { prompt, mode } = req.body;

  try {
    const systemPrompt = `
    You will receive a prompt. From there, identify the recipient of the email, generate an appropriate subject line, and write the body of the message using the ${mode} style.
    The language of the generated content (subject line and body) must match the language in which the prompt is written.
    Important: the To:, Subject:, and Content: headers must remain exactly the same and in English, regardless of the language of the content.

    The response must strictly follow the following format:
    First line: To: followed by the recipient's email address.
    Second line: Subject: followed by the subject of the email.
    Third line: Content: followed by the body of the message, which can be spread over several lines if necessary.
    `;

    const systemMessage = {
      role: 'system',
      content: systemPrompt
    }

    const userMessage = {
      role: 'user',
      content: prompt
    }

    const messages = [systemMessage, userMessage];

    const messageToSend = {
      model: process.env.LLM_MODEL,
      messages: messages
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageToSend)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const information = separateInfo(data.choices[0].message.content);
    // console.log(data.choices[0].message.content);
    res.send(information);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed generate text');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});