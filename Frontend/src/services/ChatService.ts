import type { EmailData } from '../types/interfaces';

// Obtiene la URL base de la API desde las variables de entorno.
const API_BASE_URL = import.meta.env.URL_BACKEND;

export const ChatService = {
  // Obtener chats del usuario
  getChats: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/chats`);
    if (!response.ok) throw new Error('Failed to get chats');
    return await response.json();
  },

  // Obtener mensajes de un chat específico
  getMessages: async (userId: string, chatId: number) => {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/${chatId}/messages`);
    if (!response.ok) throw new Error('Failed to get messages');
    return await response.json();
  },

  // Generar borrador usando IA (con memoria de conversación)
  generateDraft: async (prompt: string, userId: string, chatId: number, style: string = "formal") => {
    const response = await fetch(`${API_BASE_URL}/chat/createText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style, userId, chatId })
    });

    if (!response.ok) throw new Error('Failed to generate draft');
    return await response.json();
  },

  // Guardar mensaje en el chat
  saveChatMessage: async (messageData: { content: string; chatId: number; userId: string; role: string }) => {
    const response = await fetch(`${API_BASE_URL}/chat/newMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) throw new Error('Failed to save message');
    return await response.json();
  },

  // Enviar email y registrar en emailsended
  sendEmail: async (emailData: EmailData) => {
    const response = await fetch(`${API_BASE_URL}/chat/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) throw new Error('Failed to send email');
    return await response.json();
  },

  // Crear nuevo chat
  createNewChat: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/chat/newChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) throw new Error('Failed to create chat');
    return await response.json();
  },

  // Eliminar chat
  deleteChat: async (chatId: number) => {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to delete chat');
    return await response.json();
  },

  // Actualizar título del chat
  updateChatTitle: async (chatId: number, title: string) => {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/title`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    if (!response.ok) throw new Error('Failed to update chat title');
    return await response.json();
  }
};