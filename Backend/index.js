import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './utils/config.js';
import { separateInfo } from './utils/methods.js';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { auth } from './utils/auth.js';
import { corsOptions, transporter } from './utils/constant.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.all('/api/auth/*', toNodeHandler(auth.handler));
app.use(express.json());

app.post('/chat/send-email', async (req, res) => {
  const { from, to, subject, content, chatId, userId } = req.body;

  try {
    await transporter.sendMail({
      from: "guillealvarezmoreno2@gmail.com",
      to: to,
      subject: subject,
      text: content
    });

    // Guardamos el mensaje
    await pool.query(`
      INSERT INTO emailsended (idchat, iduser, from, to, content)
      VALUES ($1, $2, $3, $4)
    `, [chatId, userId, content, from, to]);
    
    res.send('Email sent');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to send email');
  }

});

app.post('/chat/createText', async (req, res) => {
  const { prompt, style = "formal", userId } = req.body;

  if (!prompt || !style) {
    res.status(400).send('Missing prompt or style');
    return;
  }

  try {
    const chats = await pool.query(`
      SELECT * FROM chat
      WHERE userid = $1
    `, [userId]);

    if (chats.rows.length === 0) {
      await pool.query(
        'INSERT INTO chat (userid) VALUES ($1)',
        [userId]
      )
    }

    const systemPrompt = `
    You will receive a prompt. From it, identify the recipient of the email, generate an appropriate subject line, and write the body of the message using the ${style} style.

    The language of the generated content — including the subject line and the body — must match the language of the prompt.

    Important: The headers **To**, **Subject**, and **Content** must also appear in the same language as the prompt, and must remain exactly as they are written in that language.

    The response must strictly follow this format:

    First line: "To" (in the same language as the prompt): followed by the recipient's email address.  
    Second line: "Subject" (in the same language as the prompt): followed by the subject of the email.  
    Third line: "Content" (in the same language as the prompt): followed by the body of the message, which can span multiple lines if needed.
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
    
    res.send(information);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed generate text');
  }
});

app.get('/chat/:userId/chats', async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).send('Missing userId');

  try {
    const chats = await pool.query(`
      SELECT * FROM chat
      WHERE userid = $1
    `, [userId]);

    res.send(chats.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to get chats');
  }
});

app.post('/chat/newChat', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).send('Missing userId');
    return;
  }

  try {
    await pool.query(`
      INSERT INTO chat (userid)
      VALUES ($1)
    `, [userId]);

    res.send('Chat created');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to create chat');
  }
})

app.get('/chat/:userId/:chatId/messages', async (req, res) => {
  const { userId, chatId } = req.params

  if (!userId || !chatId) {
    res.status(400).send('Missing userId or chatId');
    return;
  }

  try {
    const messages = await pool.query(`
      SELECT * FROM messages
      WHERE idchat = $1 AND iduser = $2
      ORDER BY sendat ASC
    `, [chatId, userId]);

    res.send(messages.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to get messages');
  }
})

app.post('/chat/newMessage', async (req, res) => {
  const { content, chatId, userId, role } = req.body;

  if (!content || !chatId || !userId || !role) {
    res.status(400).send('Missing data');
    return;
  }

  try {
    const result = await pool.query(`
      INSERT INTO messages (idchat, iduser, content, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [chatId, userId, content, role]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to save message');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});