import { useAuth } from '../../hooks/useAuth';
import { TextNoMessages } from './TextNoMessages';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { UserMessageSkeleton, AssistantMessageSkeleton } from '../Loaders/MessageSkeleton';
import { useEffect, useRef } from 'react';
import type { User, ChatSectionProps } from '../../types/interfaces';
import './styles/ChatSection.css';



export function ChatSection({ messages, onSendEmail, loading, sendingEmail }: ChatSectionProps) {
  const { user }: { user: User | null; loading: boolean } = useAuth();
  const endRef = useRef<HTMLDivElement>(null);

  const extractNameUser = (name: string) => {
    const nameArray = name.split(' ');
    return nameArray[0];
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const name = extractNameUser(user?.name || '');

  useEffect(() => {
    // Usamos un pequeño timeout para asegurar que el DOM se haya actualizado
    // antes de intentar hacer scroll.
    setTimeout(scrollToBottom, 100);
  }, [messages, loading]); 

  if (loading && messages.length === 0) {
    return (
      <>
        <UserMessageSkeleton />
        <AssistantMessageSkeleton />
        <div ref={endRef}/>
      </>
    );
  }

  return (
     <div className="min-w-full min-h-full flex flex-col pb-4">
      {messages.length > 0 ? (
        messages.map((msg, index) =>
          msg.role === 'user' ? (
            <UserMessage key={index} message={msg.content} />
          ) : (
            <AssistantMessage
              key={index}
              message={msg.content}
              onSendEmail={onSendEmail}
              sendingEmail={sendingEmail}
            />
          )
        )
      ) : (
        <TextNoMessages name={name} />
      )}
      
      {/* {loading && (
        <div className="flex justify-start items-center gap-3 mb-4">
          <img
            src="/destello.png"
            alt="Assistant Logo"
            className="w-8 h-8 rounded-full mt-1"
          />
          <p className="text-gray-500">Generating response...</p>
        </div>
      )} */}

      <div ref={endRef} />
    </div>
  );
}
