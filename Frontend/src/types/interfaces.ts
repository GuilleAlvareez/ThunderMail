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
  text: string;
}

export interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
}