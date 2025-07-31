import { useState, useEffect, useCallback, useMemo } from "react";
import { ChatService } from "../services/ChatService";
import type { Message, EmailData } from "../types/interfaces";
import { toast } from "react-toastify";

export function useChat(userId: string) {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Filtrar chats basado en la búsqueda
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }

    const query = searchQuery.toLowerCase().trim();
    return chats.filter(chat => {
      // Filtrar por ID del chat (búsqueda parcial)
      const chatIdMatch = chat.idchat.toString().toLowerCase().includes(query);
      
      // Filtrar por nombre del chat (si existe)
      const chatNameMatch = chat.name?.toLowerCase().includes(query) || false;
      
      // Filtrar por "Chat X" donde X es el ID
      const chatLabelMatch = `chat ${chat.idchat}`.toLowerCase().includes(query);
      
      // Filtrar por fecha de creación (diferentes formatos)
      const date = new Date(chat.createdat);
      const dateFormats = [
        date.toLocaleDateString().toLowerCase(),
        date.toDateString().toLowerCase(),
        date.getFullYear().toString(),
        date.getMonth() + 1 + '/' + date.getDate(),
        date.getDate() + '/' + (date.getMonth() + 1)
      ];
      const dateMatch = dateFormats.some(format => format.includes(query));
      
      return chatIdMatch || chatNameMatch || chatLabelMatch || dateMatch;
    });
  }, [chats, searchQuery]);

  // Función para actualizar la búsqueda
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Cargar mensajes de un chat específico
  // Usamos useCallback para evitar que la función se recree innecesariamente
  const loadMessages = useCallback(async (chatId: number) => {
    if (!userId || !chatId) return;

    setLoading(true);
    setError(null);
    try {
      const chatMessages = await ChatService.getMessages(userId, chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
      setMessages([]); // Limpiar mensajes en caso de error
    } finally {
      setLoading(false);
    }
  }, [userId]); // La dependencia es userId

  // Cargar chats del usuario
  const loadChats = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userChats = await ChatService.getChats(userId);
      setChats(userChats);
      
      if (userChats.length > 0 && !currentChatId) {
        // Si hay chats pero no hay uno seleccionado, seleccionar el primero
        setCurrentChatId(userChats[0].idchat);
      } else if (userChats.length === 0) {
        // Si no hay chats, crear uno nuevo
        await createNewChat(true); // Pasamos un flag para indicar que es la carga inicial
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje del usuario y generar respuesta del asistente
  const sendChatMessage = async (prompt: string, messageStyle: string) => {
    if (!prompt.trim() || !userId || !currentChatId) return;

    setLoading(true);

    try {
      // 1. Crear y guardar el mensaje del usuario en la BD primero
      const userMessage = { content: prompt, chatId: currentChatId, userId: userId, role: "user" as const };
      const savedUserMessage = await ChatService.saveChatMessage(userMessage);

      // 2. Actualizar el estado con el mensaje del usuario guardado (con ID correcto)
      setMessages(prev => [...prev, savedUserMessage]);

      // 3. Generar la respuesta del asistente
      const draft = await ChatService.generateDraft(prompt, userId, currentChatId, messageStyle);

      let assistantContent;
      if (typeof draft === 'object' && draft.to && draft.subject && draft.content !== undefined) {
        assistantContent = `To: ${draft.to}\nSubject: ${draft.subject}\nContent:\n${draft.content}`;
      } else {
        assistantContent = typeof draft === 'string' ? draft : JSON.stringify(draft);
      }

      // 4. Crear y guardar el mensaje del asistente en la BD
      const assistantMessage = { content: assistantContent, chatId: currentChatId, userId: userId, role: "assistant" as const };
      const savedAssistantMessage = await ChatService.saveChatMessage(assistantMessage);

      // 5. Actualizar el estado agregando el mensaje del asistente guardado
      setMessages(prev => [...prev, savedAssistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      // En caso de error, no necesitamos remover nada porque no hicimos actualización optimista
    } finally {
      setLoading(false);
    }
  };

  // Enviar email basado en el borrador
  const handleSendEmail = async (draftContent: string, userEmail: string) => {
    if (!userId || !currentChatId || !draftContent) return;

    setSendingEmail(true);
    try {
      const lines = draftContent.split('\n');
      const to = lines.find(l => l.startsWith('To:'))?.replace('To:', '').trim() || '';
      const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim() || '';
      const contentIndex = lines.findIndex(l => l.startsWith('Content:'));
      const content = contentIndex !== -1 ? lines.slice(contentIndex + 1).join('\n').trim() : '';

      if (!to || !subject || !content) throw new Error('Invalid draft format');

      const emailData: EmailData = { from: userEmail, to, subject, content, chatId: currentChatId, userId };
      await ChatService.sendEmail(emailData);
      toast.success('Email sent successfully!');
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  // Crear nuevo chat
  const createNewChat = async (isInitialLoad = false) => {
    if (!userId) return;

    try {
      if (!isInitialLoad) {
        setLoading(true);
      }
      const newChat = await ChatService.createNewChat(userId);
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.idchat);
      setMessages([]);
      setError(null);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat');
    } finally {
      if (!isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // *** CORRECCIÓN CLAVE ***
  // La función ahora solo cambia el estado. No es `async`.
  const switchToChat = (chatId: number) => {
    if (chatId !== currentChatId) {
      setCurrentChatId(chatId);
    }
  };

  // Eliminar chat
  const deleteChat = async (chatId: number) => {
    if (!userId) return;

    try {
      await ChatService.deleteChat(chatId);
      
      const updatedChats = chats.filter(chat => chat.idchat !== chatId);
      setChats(updatedChats);
      
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].idchat);
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('Failed to delete chat');
    }
  };

  // Cargar chats iniciales cuando el userId está disponible
  useEffect(() => {
    if (userId) {
      loadChats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // *** CORRECCIÓN CLAVE ***
  // Este useEffect ahora es la ÚNICA fuente para cargar mensajes cuando cambia el chat.
  useEffect(() => {
    if (currentChatId && userId) {
      loadMessages(currentChatId);
    } else {
      setMessages([]); // Limpiar mensajes si no hay chat seleccionado
    }
  }, [currentChatId, userId, loadMessages]);

  return {
    chats: filteredChats,
    messages,
    loading,
    error,
    currentChatId,
    searchQuery,
    updateSearchQuery,
    sendChatMessage,
    handleSendEmail,
    createNewChat,
    switchToChat,
    deleteChat,
    sendingEmail,
  };
}
