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

// Endpoint para enviar email y registrar en emailsended
app.post('/chat/send-email', async (req, res) => {
  const { from, to, subject, content, chatId, userId } = req.body;

  if (!from || !to || !subject || !content || !chatId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Enviar el email
    await transporter.sendMail({
      from: "guillealvarezmoreno2@gmail.com",
      to: to,
      subject: subject,
      text: content
    });

    // Registrar en emailsended (NO en messages)
    await pool.query(`
      INSERT INTO emailsended (idchat, iduser, "from", "to", subject, content)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [chatId, userId, from, to, subject, content]);
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Endpoint para generar borrador (solo genera, no guarda)
app.post('/chat/createText', async (req, res) => {
  const { prompt, style = "formal", userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' });
  }

  try {
    const systemPrompt = `
    You will receive a prompt. From it, identify the recipient of the email, generate an appropriate subject line, and write the body of the message using the ${style} style.

    The language of the generated content — including the subject line and the body — must match the language of the prompt.

    Important: The headers **To**, **Subject**, and **Content** must also appear in the same language as the prompt, and must remain exactly as they are written in that language.

    The response must strictly follow this format:

    First line: "To" (in the same language as the prompt): followed by the recipient's email address.  
    Second line: "Subject" (in the same language as the prompt): followed by the subject of the email.  
    Third line: "Content" (in the same language as the prompt): followed by the body of the message, which can span multiple lines if needed.
    `;

    const messageToSend = {
      model: process.env.LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageToSend)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const information = separateInfo(data.choices[0].message.content);
    
    res.status(200).json(information);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

// Endpoint para obtener chats del usuario
app.get('/chat/:userId/chats', async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const chats = await pool.query(`
      SELECT * FROM chat WHERE userid = $1
    `, [userId]);

    res.status(200).json(chats.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

// Endpoint para crear nuevo chat
app.post('/chat/newChat', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO chat (userid) VALUES ($1) RETURNING *
    `, [userId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Endpoint para obtener mensajes de un chat específico
app.get('/chat/:userId/:chatId/messages', async (req, res) => {
  const { userId, chatId } = req.params;

  if (!userId || !chatId) {
    return res.status(400).json({ error: 'Missing userId or chatId' });
  }

  try {
    const messages = await pool.query(`
      SELECT * FROM messages
      WHERE idchat = $1 AND iduser = $2
      ORDER BY sendat ASC
    `, [chatId, userId]);

    res.status(200).json(messages.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Endpoint para guardar nuevo mensaje en el chat
app.post('/chat/newMessage', async (req, res) => {
  const { content, chatId, userId, role } = req.body;

  if (!content || !chatId || !userId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['user', 'assistant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
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
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
