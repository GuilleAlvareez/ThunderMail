import { useState, useEffect } from "react";
import { ChatService } from "../services/ChatService";
import type { Message, EmailData } from "../types/interfaces";

export function useChat(userId: string, style: string = "formal") {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
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
      
      // Si no hay chats, crear uno nuevo automáticamente
      if (userChats.length === 0) {
        const newChat = await ChatService.createNewChat(userId);
        setChats([newChat]);
        setCurrentChatId(newChat.idchat);
      } else if (!currentChatId) {
        // Si hay chats pero no hay uno seleccionado, seleccionar el primero
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

      // 3. Generar borrador con IA (ahora con memoria y estilo)
      const draft = await ChatService.generateDraft(prompt, userId, currentChatId, style);
      
      // 4. Verificar si la respuesta es un email estructurado o texto plano
      let assistantContent;
      
      if (typeof draft === 'object' && draft.to && draft.subject && draft.content !== undefined) {
        // Es un email estructurado
        assistantContent = `To: ${draft.to}\nSubject: ${draft.subject}\nContent:\n${draft.content}`;
      } else {
        // Es texto plano (pregunta de la IA o respuesta conversacional)
        assistantContent = typeof draft === 'string' ? draft : JSON.stringify(draft);
      }
      
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
      setLoading(true);
      const newChat = await ChatService.createNewChat(userId);
      setChats(prev => [newChat, ...prev]); // Agregar al inicio
      setCurrentChatId(newChat.idchat);
      setMessages([]); // Limpiar mensajes
      setError(null); // Limpiar errores
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar chat activo
  const switchToChat = async (chatId: number) => {
    if (chatId === currentChatId) return; // No hacer nada si ya es el chat activo
    
    setCurrentChatId(chatId);
    setMessages([]); // Limpiar mensajes inmediatamente
    setLoading(true);
    
    try {
      await loadMessages(chatId);
    } catch (error) {
      console.error('Error switching chat:', error);
      setError('Failed to switch chat');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar chat
  const deleteChat = async (chatId: number) => {
    if (!userId) return;

    try {
      await ChatService.deleteChat(chatId);
      
      // Actualizar lista de chats
      const updatedChats = chats.filter(chat => chat.idchat !== chatId);
      setChats(updatedChats);
      
      // Si el chat eliminado era el activo, cambiar a otro
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].idchat);
          await loadMessages(updatedChats[0].idchat);
        } else {
          // Si no hay más chats, crear uno nuevo
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('Failed to delete chat');
    }
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
    deleteChat,
    loadChats,
    loadMessages
  };
}
