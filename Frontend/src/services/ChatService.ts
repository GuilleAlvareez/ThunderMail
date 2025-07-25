import type { Message, EmailData } from '../types/interfaces';

export const ChatService = {
  // Obtener chats del usuario
  getChats: async (userId: string) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/chats`);
    if (!response.ok) throw new Error('Failed to get chats');
    return await response.json();
  },

  // Obtener mensajes de un chat específico
  getMessages: async (userId: string, chatId: number) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/${chatId}/messages`);
    if (!response.ok) throw new Error('Failed to get messages');
    return await response.json();
  },

  // Generar borrador usando IA (con memoria de conversación)
  generateDraft: async (prompt: string, userId: string, chatId: number, style: string = "formal") => {
    const response = await fetch(`http://localhost:3000/chat/createText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style, userId, chatId })
    });

    if (!response.ok) throw new Error('Failed to generate draft');
    return await response.json();
  },

  // Guardar mensaje en el chat
  saveChatMessage: async (messageData: { content: string; chatId: number; userId: string; role: string }) => {
    const response = await fetch(`http://localhost:3000/chat/newMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) throw new Error('Failed to save message');
    return await response.json();
  },

  // Enviar email y registrar en emailsended
  sendEmail: async (emailData: EmailData) => {
    const response = await fetch('http://localhost:3000/chat/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) throw new Error('Failed to send email');
    return await response.json();
  },

  // Crear nuevo chat
  createNewChat: async (userId: string) => {
    const response = await fetch(`http://localhost:3000/chat/newChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) throw new Error('Failed to create chat');
    return await response.json();
  }
};
