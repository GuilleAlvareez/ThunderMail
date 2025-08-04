export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountLogoProps {
  user: User;
  logoutFunction: () => void;
}

export type LoginButtonProps = {
  loginFunction: () => void;
};

export interface HistoryCardProps {
  id: number;
  title?: string;
  isActive: boolean;
  onClick: () => void;
}

export interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface Message {
  iduser: string;
  content: string;
  idchat: number;
  role: 'user' | 'assistant';
}

// NUEVA: Interfaz para los datos de un email a enviar
export interface EmailData {
  from: string;
  to: string;
  subject: string;
  content: string;
  chatId: number;
  userId: string;
}

// Props para componentes de Chat
export interface AssistantMessageProps {
  message: string;
  onSendEmail?: (draftContent: string) => void;
  sendingEmail?: boolean;
}

export interface UserMessageProps {
  message: string;
}

/**
 * Props para el componente ChatSection que gestiona la sección principal de chat.
 * @property {Message[]} messages - Array de mensajes que se mostrarán en el chat
 * @property {(draftContent: string) => void} onSendEmail - Función para manejar el envío de emails
 * @property {boolean} loading - Indica si se está cargando un nuevo mensaje
 * @property {boolean} sendingEmail - Indica si se está procesando el envío de un email
 */
export interface ChatSectionProps {
  messages: Message[];
  onSendEmail: (draftContent: string) => void;
  loading: boolean;
  sendingEmail: boolean;
}

/**
 * Props para el componente FooterChat que contiene el área de entrada de mensajes.
 * @property {(prompt: string) => void} sendChatMessage - Función para enviar nuevos mensajes
 * @property {boolean} [isDisabled] - Indica si la entrada de mensajes está deshabilitada
 */
export interface FooterChatProps {
  sendChatMessage: (prompt: string) => void;
  isDisabled?: boolean;
}

/**
 * Props para el componente TextNoMessages que se muestra cuando no hay mensajes.
 * @property {string} name - Nombre del usuario para personalizar el mensaje
 */
export interface TextNoMessagesProps {
  name: string;
}

/**
 * Props para el componente AuthModal que maneja la autenticación.
 * @property {boolean} isOpen - Controla la visibilidad del modal
 * @property {() => void} onClose - Función para cerrar el modal
 */
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}


