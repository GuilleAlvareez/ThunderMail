import { useAuth } from '../../hooks/useAuth';
import { TextNoMessages } from './TextNoMessages';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import type { User, Message } from '../../types/interfaces';

interface ChatSectionProps {
  messages: Message[];
  onSendEmail: (draftContent: string) => void;
  loading: boolean;
}

export function ChatSection({ messages, onSendEmail, loading }: ChatSectionProps) {
  const { user }: { user: User | null; loading: boolean } = useAuth();

  const extractNameUser = (name: string) => {
    const nameArray = name.split(' ');
    return nameArray[0];
  };

  const name = extractNameUser(user?.name || '');

  if (loading && messages.length === 0) return <p>Cargando...</p>;

  return (
    <div className="h-full w-full flex flex-col">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          msg.role === 'user' ? (
            <UserMessage message={msg.content} key={index} />
          ) : (
            <AssistantMessage 
              message={msg.content} 
              key={index}
              onSendEmail={onSendEmail}
            />
          )
        ))
      ) : (
        <TextNoMessages name={name} />
      )}
      {loading && <p className="text-center text-gray-500">Generando respuesta...</p>}
    </div>
  );
}
