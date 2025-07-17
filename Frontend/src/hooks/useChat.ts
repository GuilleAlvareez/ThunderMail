import { useState, useEffect } from "react";
import { ChatService } from "../services/ChatService";
import type { Message, EmailData } from "../types/interfaces";

export function useChat(userId: string) {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar chats del usuario
  const loadChats = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userChats = await ChatService.getChats(userId);
      setChats(userChats);
      
      // Si no hay chats, crear uno nuevo
      if (userChats.length === 0) {
        const newChat = await ChatService.createNewChat(userId);
        setChats([newChat]);
        setCurrentChatId(newChat.idchat);
      } else {
        setCurrentChatId(userChats[0].idchat);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Cargar mensajes de un chat específico
  const loadMessages = async (chatId: number) => {
    if (!userId || !chatId) return;

    try {
      setLoading(true);
      const chatMessages = await ChatService.getMessages(userId, chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje del usuario y generar respuesta del asistente
  const sendChatMessage = async (prompt: string) => {
    if (!prompt.trim() || !userId || !currentChatId) return;

    try {
      // 1. Guardar mensaje del usuario inmediatamente
      const userMessage = {
        content: prompt,
        chatId: currentChatId,
        userId: userId,
        role: "user"
      };

      const savedUserMessage = await ChatService.saveChatMessage(userMessage);
      
      // 2. Actualizar UI optimísticamente
      setMessages(prev => [...prev, savedUserMessage]);
      setLoading(true);

      // 3. Generar borrador con IA
      const draft = await ChatService.generateDraft(prompt, userId);
      
      // 4. Formatear y guardar respuesta del asistente
      const assistantContent = `To: ${draft.to}\nSubject: ${draft.subject}\nContent:\n${draft.content}`;
      
      const assistantMessage = {
        content: assistantContent,
        chatId: currentChatId,
        userId: userId,
        role: "assistant"
      };

      const savedAssistantMessage = await ChatService.saveChatMessage(assistantMessage);
      
      // 5. Actualizar UI con respuesta del asistente
      setMessages(prev => [...prev, savedAssistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Enviar email basado en el borrador
  const handleSendEmail = async (draftContent: string, userEmail: string) => {
    if (!userId || !currentChatId || !draftContent) return;

    try {
      // Parsear el contenido del borrador
      const lines = draftContent.split('\n');
      const to = lines.find(l => l.startsWith('To:'))?.replace('To:', '').trim() || '';
      const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim() || '';
      const contentIndex = lines.findIndex(l => l.startsWith('Content:'));
      const content = contentIndex !== -1 ? lines.slice(contentIndex + 1).join('\n').trim() : '';

      if (!to || !subject || !content) {
        throw new Error('Invalid draft format');
      }

      const emailData: EmailData = {
        from: userEmail,
        to,
        subject,
        content,
        chatId: currentChatId,
        userId,
      };

      await ChatService.sendEmail(emailData);
      alert('¡Correo enviado y registrado con éxito!');
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el correo.');
    }
  };

  // Crear nuevo chat
  const createNewChat = async () => {
    if (!userId) return;

    try {
      const newChat = await ChatService.createNewChat(userId);
      setChats(prev => [...prev, newChat]);
      setCurrentChatId(newChat.idchat);
      setMessages([]);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat');
    }
  };

  // Cambiar chat activo
  const switchToChat = async (chatId: number) => {
    setCurrentChatId(chatId);
    await loadMessages(chatId);
  };

  // Cargar chats al montar el componente
  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId]);

  // Cargar mensajes cuando cambia el chat activo
  useEffect(() => {
    if (currentChatId && userId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId, userId]);

  return {
    chats,
    messages,
    loading,
    error,
    currentChatId,
    sendChatMessage,
    handleSendEmail,
    createNewChat,
    switchToChat,
    loadChats,
    loadMessages
  };
}
