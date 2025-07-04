
interface SectionCardProps {
  text: string;
  icon: React.ReactNode;
};

export function SectionCard({ text, icon }: SectionCardProps) {
  return (
    <div className="w-full flex flex-row items-center bg-transparent py-2 pl-3 pr-4 mb-3">
      {icon}
      <h2 className="">{text}</h2>
    </div>
  );
};
