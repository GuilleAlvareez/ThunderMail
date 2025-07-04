
interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
};

export function SectionCard({ text, icon }: SectionCardProps) {
  return (
    <div className="w-full flex flex-row items-center bg-transparent rounded-full py-2 pl-3 pr-4 mb-3 hover:bg-hoverSidebar">
      {icon}
      <h2 className="">{text}</h2>
    </div>
  );
};
