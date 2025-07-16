export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
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
}

export interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
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