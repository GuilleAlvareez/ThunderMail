import { HistoryCard } from './HistoryCard';
import { SectionCard } from './SectionCard';
import { Compass, Book, Inbox, History } from "lucide-react";

export function SideBar() {
  const textTest = [
    'text1',
    'text2',
    'text3',
  ];

  const sections = [
    { text: "Explore", icon: Compass },
    { text: "Libraries", icon: Book },
    { text: "Files", icon: Inbox },
    { text: "History", icon: History },
  ];

  return (
    <div className="h-full w-1/6 flex flex-col px-3 pt-4 bg-blue-500">
      <div className='h-8 flex items-center mb-4'>
        <img src="/destello.png" alt="Logo" className="h-7 mr-1" />
        <h1 className='font-bold text-xl'>ThunderMail.ai</h1>
      </div>

      <input type="text" className='h-8 rounded-full' />
      <section className='pl-2'>
        {sections.map(({ text, icon: Icon }, index) => (
          <SectionCard text={text} icon={<Icon className='text-black' />} key={index} />
        ))}
        
        {textTest.map((text, index) => (
          <HistoryCard text={text} key={index} />
        ))}        
      </section>
    </div>
  );
}