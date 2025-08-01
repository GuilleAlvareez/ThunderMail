import { InputSearch } from './InputSearch';
import { SectionCard } from './SectionCard';
import { HistoryCard } from './HistoryCard';
import { ChatHistorySkeleton } from '../Loaders/ChatHistorySkeleton';
import { Separator } from './Separator';
import { useChatContext } from '../../context/ChatContext';
import { MessageSquarePlus, Archive, Trash2 } from 'lucide-react';

export function SideBar() {
  const { chats, createNewChat, switchToChat, currentChatId, loading } = useChatContext();

  const sections = [
    { text: 'New Chat', icon: MessageSquarePlus, onClick: createNewChat },
    // { text: 'Archive', icon: Archive, onClick: () => console.log('Archive clicked') },
    // { text: 'Trash', icon: Trash2, onClick: () => console.log('Trash clicked') },
  ];

  const handleSwitchChat = (chatId: number) => {
    switchToChat(chatId);
  };

  return (
    <div className="h-full w-1/6 flex flex-col px-4 pt-5 bg-blue-00">
      <div className='h-8 flex items-center ml-1.5 mb-4'>
        <img src="./ThunderMailLogo.png" alt="Logo" className="h-7 mr-2" />
        <h1 className='font-bold text-xl'>ThunderMail.ai</h1>
      </div>

      <section className='flex flex-col flex-grow pl-1 pr-1 w-full overflow-hidden'>
        <InputSearch />

        {sections.map(({ text, icon: Icon, onClick }, index) => (
          <SectionCard 
            text={text} 
            icon={<Icon className='w-6 h-6 text-black mr-2 stroke-1' />} 
            key={index}
            onClick={onClick}
          />
        ))}

        <Separator />

        <h2 className='text-textBar my-2'>RECENT CHATS</h2>

        {loading ? (
          <ChatHistorySkeleton />
        ) : (
          <div className='flex-1 overflow-y-auto pr-1'>
            {chats.map((chat) => (
              <HistoryCard 
                id={chat.idchat} 
                key={chat.idchat}
                isActive={chat.idchat === currentChatId}
                onClick={() => handleSwitchChat(chat.idchat)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
