import type { SectionCardProps } from '../../types/interfaces';

export function SectionCard({ text, icon }: SectionCardProps) {
  return (
    <div className="w-full flex flex-row items-center bg-transparent rounded-full py-2 pl-3 pr-4 mb-3 cursor-pointer hover:bg-hoverSidebar">
      {icon}
      <h2 className="">{text}</h2>
    </div>
  );
};
