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

// Endpoint para generar borrador (con memoria de conversación)
app.post('/chat/createText', async (req, res) => {
  const { prompt, style, userId, chatId } = req.body;

  if (!prompt || !userId || !chatId) {
    return res.status(400).json({ error: 'Missing prompt, userId or chatId' });
  }
  
  try {
    // Obtener mensajes anteriores del chat para contexto
    const previousMessages = await pool.query(`
      SELECT content, role FROM messages
      WHERE idchat = $1 AND iduser = $2
      ORDER BY sendat ASC
    `, [chatId, userId]);

    const systemPrompt = `
    You will receive a prompt written by the user. Based on that prompt, perform the following tasks:

    1. Identify the recipient of the email (e.g., their email address or full name).

    2. Generate an appropriate subject line based on the content and purpose.

    3. Write the body of the email using a style ${style}.

    4. Extract and use all relevant and usable information from the prompt.

    5. The language of the entire output — including subject line and body — must match the language of the prompt exactly.

    6.IMPORTANT: Do not use placeholders such as [Your Name]. If you don't have the name to the person send the mail and you need it to writte the email, ask the user directly instead with an unstructured message asking for that information — do not follow the output format in that case.

    7. Only when all necessary information is available, follow this exact format, and use the same language as the prompt:
    To: [recipient email address]  
    Subject: [email subject line]  
    Content:

    [email body written in the specified style]
    (If the prompt is in Spanish, use Para, Asunto, and Contenido. Match the prompt language exactly for these headers.)

    ⚠️ If any required information is missing, break the format and respond with a clear, conversational message asking the user for what’s missing — in the same language as the prompt.
    `;

    // Construir el array de mensajes con contexto
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Agregar mensajes anteriores como contexto
    previousMessages.rows.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Agregar el prompt actual del usuario
    messages.push({ role: 'user', content: prompt });

    const messageToSend = {
      model: process.env.LLM_MODEL,
      messages: messages
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
    const aiResponse = data.choices[0].message.content;
    
    // Intentar separar la información como email estructurado
    const information = separateInfo(aiResponse);
    
    // Si separateInfo devuelve null, significa que no es un email estructurado
    // En ese caso, devolver el texto plano directamente
    if (information === null) {
      res.status(200).json(aiResponse);
    } else {
      res.status(200).json(information);
    }
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

    res.status(200).json(chats.rows.reverse());
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
      INSERT INTO chat (userid, createdat) VALUES ($1, NOW()) RETURNING *
    `, [userId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Endpoint para eliminar chat
app.delete('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ error: 'Missing chatId' });
  }

  try {
    // Eliminar mensajes del chat primero
    await pool.query('DELETE FROM messages WHERE idchat = $1', [chatId]);
    
    // Eliminar emails enviados del chat
    await pool.query('DELETE FROM emailsended WHERE idchat = $1', [chatId]);
    
    // Eliminar el chat
    await pool.query('DELETE FROM chat WHERE idchat = $1', [chatId]);

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete chat' });
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
