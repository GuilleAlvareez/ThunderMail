import { useState, useEffect } from "react";
import { ChatService } from "../services/ChatService";
import type { Message, EmailData } from "../types/interfaces";
import { string } from "better-auth";

export function useChat(userId: string) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadChats = async () => {
    try {
      setLoading(true);
      console.log("userId", userId);
      setChats(await ChatService.getChats(userId));
      setLoading(false);
      return chats;
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  const generateDraft = async (chatId: string) => {
    try {
      setLoading(true);
      setMessages(await ChatService.generateDraft(userId, 1));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  const sendChatMessage = async (prompt: string, userId: string) => {
    if (!prompt) return;

    const userMsgData = {
      content: prompt,
      idchat: 1,
      iduser: userId,
      role: "user"
    };

    try {
      await ChatService.saveChatMessage(userMsgData);
      setLoading(true);
      const draft = await ChatService.generateDraft(userId, 1);
      const assistantContent = `To: ${draft.to}\nSubject: ${draft.subject}\nContent:\n${draft.content}`;

      const assistantMsgData = { 
        content: assistantContent, 
        idchat: 1, 
        iduser: userId, 
        role: "assistant" 
      } as const;

      const savedAssistantMsg = await ChatService.saveChatMessage(assistantMsgData);
      setMessages(prev => [...prev, savedAssistantMsg]);

    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleSendEmail = async (draftContent: string, chatId: number, userId: string, userEmail: string) => {
    if (!userId || !chatId || !userId) return;

    // Parseamos el contenido del borrador para obtener to, subject, content
    const lines = draftContent.split('\n');
    const to = lines.find(l => l.startsWith('To:'))?.replace('To:', '').trim() || '';
    const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim() || '';
    const contentIndex = lines.findIndex(l => l.startsWith('Content:'));
    const content = contentIndex !== -1 ? lines.slice(contentIndex + 1).join('\n') : '';

    const emailData: EmailData = {
      from: userEmail,
      to,
      subject,
      content,
      chatId,
      userId,
    };

    try {
      await ChatService.sendEmail(emailData);
      alert('¡Correo enviado y registrado con éxito!');
      // Opcional: podrías añadir un mensaje de sistema al chat indicando que el email se envió.
    } catch (error) {
      console.error(error);
      alert('Error al enviar el correo.');
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadChats();
  }, [userId]);

  return { chats, loading, error, messages, loadChats, generateDraft, sendChatMessage, handleSendEmail };
}