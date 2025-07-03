import { MessageCircle } from "lucide-react";


interface HistoryCardProps {
  text: string;
}

export function HistoryCard({ text }: HistoryCardProps) {
  return (
    <button className="bg-transparent flex items-center justify-center w-fit border border-border rounded-md py-2 pl-3 pr-4 mb-1 shadow transition-all duration-100 ease-in-out hover:bg-hoverSidebar active:scale-95">
      <MessageCircle className="w-6 h-6 stroke-1 mr-1" />
      <span>{text}</span>
    </button>
  );
}
