import { useAuth } from '../../hooks/useAuth';
import { TextNoMessages } from './TextNoMessages';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { useChat } from '../../hooks/useChat';
import type { User } from '../../types/interfaces';


export function ChatSection() {
  const { user, loading }: { user: User | null; loading: boolean } = useAuth();
  const { messages, loadChats, generateDraft } = useChat(user?.id);

  const messagesTest = [
    { message: 'Hola como estás?', isUser: true },
    { message: 'Buenas tardes', isUser: false },
    { message: '¿Qué tal?', isUser: true },
  ];

  const extractNameUser = (name: string) => {
    const nameArray = name.split(' ');
    return nameArray[0];
  };

  const name = extractNameUser(user?.name || '');

  if (loading) return <p>Cargando...</p>

  return (
    <div className="h-full w-full flex flex-col">
      {messagesTest && messagesTest.length > 0 ? (
        messagesTest.map((msg, index) => (
          //meter condicional segun isUser o role renderizar un compoente u otro
          msg.isUser ? (
            <UserMessage message={msg.message} key={index} />
          ) : (
            <AssistantMessage message={msg.message} key={index} />
          )
      ))
      ) : (
        <TextNoMessages name={name} />
      )}
    </div>
  );
}