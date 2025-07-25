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
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
