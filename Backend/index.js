import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { pool } from './utils/config.js';
import { separateInfo } from './utils/methods.js';

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


app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' })
  }

  try {
    const authResponse = await auth.api.signInEmail({
      body: {
        email: email,
        password: password
      },
      asResponse: true
    })

    console.log('despues de Auth Response:')

    if (authResponse.ok) {
      console.log('dentro de authResponse.ok')
      const cookies = authResponse.headers.getSetCookie()
      const sessionData = await authResponse.json()
      console.log('Session Data:', sessionData)

      // EXTRAE EL TOKEN DE LA COOKIE PARA ENVIARLO
      const sessionTokenCookie = cookies.find(c => c.startsWith('__secure-better-auth.session_token'))
      const sessionToken = sessionTokenCookie ? sessionTokenCookie.split(';')[0].split('=')[1] : null
      console.log('Session Token:', sessionToken)

      res.setHeader('Set-Cookie', cookies)
      console.log('Cookies seteadas:', cookies)

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        user: sessionData.user,
        token: sessionToken
      })
    } else {
      let errorBody = { message: 'Error al iniciar sesión.' }
      try {
        errorBody = await authResponse.json()
      } catch (e) {
      }
      console.error('Error de Better Auth:', errorBody)
      return res.status(authResponse.status).json(errorBody)
    }
  } catch (error) {
    console.error('Error inesperado en /login:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

app.post('/register', async (req, res) => {
  const { email, password, name, username } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, contraseña y nombre son requeridos.' })
  }

  // si no existe auth.options.plugins este sera undefined gracias al ?
  if (auth.options.plugins?.some(p => p.id === 'username') && !username) {
    return res.status(400).json({ message: 'Nombre de usuario es requerido.' })
  }

  try {
    const registrationResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // añadimos username solo si tiene un valor
        ...(username && { username }),
        admin: false
      }
    })

    console.log('Usuario registrado:', registrationResult)

    return res.status(201).json({
      message: 'Usuario registrado exitosamente. Por favor, inicia sesión.'
    })
  } catch (error) {
    console.error('Error durante el registro:', error)
    return res.status(500).json({ message: 'Error interno del servidor durante el registro.' })
  }
})

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