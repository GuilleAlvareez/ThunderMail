import { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';

// Definir el tipo para el valor del contexto, basado en lo que devuelve useChat
type ChatContextType = ReturnType<typeof useChat>;

// Crear el contexto con un valor inicial undefined
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Crear el componente Provider
export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const chatLogic = useChat(user?.id || ''); // El hook se llama UNA SOLA VEZ aquí

  // Si no hay usuario, no renderizar el provider aún
  if (!user?.id) {
    return (
      <ChatContext.Provider value={undefined}>
        {children}
      </ChatContext.Provider>
    );
  }

  return (
    <ChatContext.Provider value={chatLogic}>
      {children}
    </ChatContext.Provider>
  );
}

// Crear un hook personalizado para consumir el contexto
export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    return {
      chats: [],
      messages: [],
      loading: false,
      chatsLoading: false, // Agregar chatsLoading al fallback
      error: null,
      currentChatId: null,
      searchQuery: "",
      updateSearchQuery: () => {},
      sendChatMessage: async () => {},
      handleSendEmail: async () => {},
      createNewChat: async () => {},
      switchToChat: () => {},
      deleteChat: async () => {},
      sendingEmail: false,
    };
  }
  return context;
}

