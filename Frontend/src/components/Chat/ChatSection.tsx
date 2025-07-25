import { useAuth } from '../../hooks/useAuth';
import { TextNoMessages } from './TextNoMessages';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { useEffect, useRef } from 'react';
import type { User, Message } from '../../types/interfaces';
import './styles/ChatSection.css';

interface ChatSectionProps {
  messages: Message[];
  onSendEmail: (draftContent: string) => void;
  loading: boolean;
}

export function ChatSection({ messages, onSendEmail, loading }: ChatSectionProps) {
  const { user }: { user: User | null; loading: boolean } = useAuth();
  const endRef = useRef<HTMLDivElement>(null);

  const extractNameUser = (name: string) => {
    const nameArray = name.split(' ');
    return nameArray[0];
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const name = extractNameUser(user?.name || '');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) return <p>Cargando...</p>;

  return (
     <div className="h-full w-full flex flex-col">
      {messages.length > 0 ? (
        messages.map((msg, index) =>
          msg.role === 'user' ? (
            <div>
              <UserMessage message={msg.content} key={index} />
              <div ref={endRef}/>
            </div>
          ) : (
            <div>
              <AssistantMessage
                message={msg.content}
                key={index}
                onSendEmail={onSendEmail}
              />
              <div />
            </div>
          )
        )
      ) : (
        <TextNoMessages name={name} />
      )}
      {loading && <p className="text-center text-gray-500">Generando respuesta...</p>}
    </div>
  );
}
