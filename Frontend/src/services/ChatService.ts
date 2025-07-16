import type { Message, EmailData } from '../types/interfaces';

export const ChatService = {
  getChats: async (userId: string) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/chats`);
    return await response.json();
  },

  generateDraft: async (userId: string, chatId: number) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/${chatId}/messages`);
    return await response.json();
  },

  saveChatMessage: async (messageData: { content: string; idchat: number; iduser: string; role: string }) => {
    const response = await fetch(`http://localhost:3000/chat/newMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) throw new Error('Failed to save message');
  
    return await response.json();
  },

  sendEmail: async (emailData: EmailData) => {
    const response = await fetch('http://localhost:3000/chat/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
    });

    if (!response.ok) throw new Error('Failed to send email');

    return await response.json();
  }
}