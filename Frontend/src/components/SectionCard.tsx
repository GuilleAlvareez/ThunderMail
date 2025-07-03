
interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
};

export function SectionCard({ text, icon }: SectionCardProps) {
  return (
    <div className="flex flex-row items-center gap-1 bg-transparent py-2 pl-3 pr-4">
      {icon}
      <h2 className="">{text}</h2>
    </div>
  );
};
