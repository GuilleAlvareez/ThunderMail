import { useState, useEffect, useCallback, useMemo } from "react";
import { ChatService } from "../services/ChatService";
import type { Message, EmailData } from "../types/interfaces";
import { toast } from "react-toastify";

export function useChat(userId: string) {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false); // Nuevo estado para cargar chats
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
      const chatNameMatch = chat.title?.toLowerCase().includes(query) || false;
      
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
      setChatsLoading(true); // Usar chatsLoading en lugar de loading
      const userChats = await ChatService.getChats(userId);
      setChats(userChats);
      
      // Obtener chatId de la URL
      const params = new URLSearchParams(window.location.search);
      const chatIdFromUrl = params.get("chat");
      
      if (chatIdFromUrl && userChats.some(chat => chat.idchat === parseInt(chatIdFromUrl))) {
        // Si hay un chat válido en la URL, seleccionarlo
        setCurrentChatId(parseInt(chatIdFromUrl));
      } else if (userChats.length > 0 && !currentChatId) {
        // Si hay chats pero no hay uno seleccionado, seleccionar el primero
        setCurrentChatId(userChats[0].idchat);
      } else if (userChats.length === 0) {
        // Si no hay chats, crear uno nuevo
        await createNewChat(true);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setError('Failed to load chats');
    } finally {
      setChatsLoading(false); // Usar chatsLoading
    }
  };

  // Función para generar título basado en la dirección de correo del borrador
  const generateChatTitle = (aiResponse: string): string => {
    // Buscar la línea que contiene "To:"
    const lines = aiResponse.split('\n');
    const toLine = lines.find(line => line.trim().startsWith('To:'));
    
    if (toLine) {
      // Extraer el email después de "To:"
      const email = toLine.replace('To:', '').trim();
      return email;
    }
    
    // Fallback: usar las primeras palabras si no es un email
    const words = aiResponse.trim().split(' ').slice(0, 5);
    let title = words.join(' ');
    
    if (title.length > 30) {
      title = title.substring(0, 27) + '...';
    }
    
    return title;
  };

  // Enviar mensaje del usuario y generar respuesta del asistente
  const sendChatMessage = async (prompt: string, messageStyle: string) => {
    if (!prompt.trim() || !userId) return;

    // Si no hay currentChatId, crear un chat primero
    let chatId = currentChatId;
    if (!chatId) {
      try {
        const newChat = await ChatService.createNewChat(userId);
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.idchat);
        chatId = newChat.idchat;
        
        // Actualizar URL con el nuevo chatId
        const params = new URLSearchParams(window.location.search);
        params.set("chat", newChat.idchat.toString());
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newURL);
      } catch (error) {
        console.error('Error creating chat:', error);
        setError('Failed to create chat');
        return;
      }
    }

    setLoading(true);

    try {
      // Verificar si es el primer mensaje del chat
      const isFirstMessage = messages.length === 0;

      // 1. Crear y guardar el mensaje del usuario en la BD primero
      const userMessage = { content: prompt, chatId: chatId, userId: userId, role: "user" as const };
      const savedUserMessage = await ChatService.saveChatMessage(userMessage);

      // 2. Actualizar el estado con el mensaje del usuario guardado
      setMessages(prev => [...prev, savedUserMessage]);

      // 4. Generar la respuesta del asistente
      const draft = await ChatService.generateDraft(prompt, userId, chatId, messageStyle);

      let assistantContent;
      if (typeof draft === 'object' && draft.to && draft.subject && draft.content !== undefined) {
        assistantContent = `To: ${draft.to}\nSubject: ${draft.subject}\nContent:\n${draft.content}`;
      } else {
        assistantContent = typeof draft === 'string' ? draft : JSON.stringify(draft);
      }

      // 3. Si es el primer mensaje, generar y actualizar el título del chat usando la respuesta de la IA
      if (isFirstMessage) {
        try {
          const title = generateChatTitle(assistantContent);
          await ChatService.updateChatTitle(chatId, title);
          
          // Actualizar el chat en el estado local
          setChats(prev => prev.map(chat => 
            chat.idchat === chatId 
              ? { ...chat, title } 
              : chat
          ));
        } catch (error) {
          console.error('Error updating chat title:', error);
          // No interrumpir el flujo si falla la actualización del título
        }
      }

      // 5. Crear y guardar el mensaje del asistente en la BD
      const assistantMessage = { content: assistantContent, chatId: chatId, userId: userId, role: "assistant" as const };
      const savedAssistantMessage = await ChatService.saveChatMessage(assistantMessage);

      // 6. Actualizar el estado agregando el mensaje del asistente guardado
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
      
      // Actualizar URL con el nuevo chatId
      const params = new URLSearchParams(window.location.search);
      params.set("chat", newChat.idchat.toString());
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newURL);
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
      
      // Actualizar URL con el chatId
      const params = new URLSearchParams(window.location.search);
      params.set("chat", chatId.toString());
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newURL);
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
    chatsLoading, // Exportar el nuevo estado
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
