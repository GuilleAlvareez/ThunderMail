import { useAuth } from '../../hooks/useAuth';
import { TextNoMessages } from './TextNoMessages';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { useChat } from '../../hooks/useChat';
import type { User, Message } from '../../types/interfaces';

interface ChatSectionProps {
  messages: Message[];
  onSendEmail: (draftContent: string) => void;
  loading: boolean;
}

export function ChatSection({ messages, onSendEmail, loading }: ChatSectionProps) {
  const { user }: { user: User | null; loading: boolean } = useAuth();

  // const messagesTest = [
  //   { message: 'Hola como estás?', isUser: true },
  //   { message: 'Buenas tardes', isUser: false },
  //   { message: '¿Qué tal?', isUser: true },
  // ];

  const extractNameUser = (name: string) => {
    const nameArray = name.split(' ');
    return nameArray[0];
  };

  const name = extractNameUser(user?.name || '');

  if (loading) return <p>Cargando...</p>

  return (
    <div className="h-full w-full flex flex-col">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          //meter condicional segun isUser o role renderizar un compoente u otro
          msg.role === 'user' ? (
            <UserMessage message={msg.content} key={index} />
          ) : (
            <AssistantMessage message={msg.content} key={index} />
          )
      ))
      ) : (
        <TextNoMessages name={name} />
      )}
    </div>
  );
}