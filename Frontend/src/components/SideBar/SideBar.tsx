import { HistoryCard } from './HistoryCard';
import { SectionCard } from './SectionCard';
import { Compass, Book, Inbox, History } from "lucide-react";
import { Separator } from './Separator';
import { InputSearch } from './InputSearch';
import { useChat } from '../../hooks/useChat';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function SideBar() {
  const { user } = useAuth();
  const { chats } = useChat(user?.id);

  const sections = [
    { text: "Explore", icon: Compass },
    { text: "Libraries", icon: Book },
    { text: "Files", icon: Inbox },
    { text: "History", icon: History },
  ];

  return (
    <div className="h-full w-1/6 flex flex-col px-4 pt-5 bg-blue-00">
      <div className='h-8 flex items-center ml-1.5 mb-4'>
        <img src="./ThunderMailLogo.png" alt="Logo" className="h-7 mr-2" />
        <h1 className='font-bold text-xl'>ThunderMail.ai</h1>
      </div>

      <section className='pl-1 pr-1 w-full'>
        <InputSearch />
        
        {sections.map(({ text, icon: Icon }, index) => (
          <SectionCard text={text} icon={<Icon className='w-6 h-6 text-black mr-2 stroke-1' />} key={index} />
        ))}
        
        <Separator />

        <h2 className='text-textBar my-2'>RECENTS CHATS</h2>
        {chats.map(({ idchat }, index) => (
          <HistoryCard id={idchat} key={index} />
        ))}        
      </section>
    </div>
  );
}