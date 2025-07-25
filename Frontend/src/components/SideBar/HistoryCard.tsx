import { MessageCircle } from "lucide-react";
import type { HistoryCardProps } from '../../types/interfaces';

export function HistoryCard({ id, isActive, onClick }: HistoryCardProps) {
  return (
    <button 
      className={`bg-transparent w-full flex items-center justify-start border border-border rounded-md py-2 pl-3 pr-4 mb-2 shadow transition-all duration-100 ease-in-out hover:bg-hoverSidebar active:scale-95 ${
        isActive ? 'border-gradientText bg-hoverSidebar' : 'border-border'
      }`}
      onClick={onClick}
    >
      <MessageCircle className="w-6 h-6 stroke-1 mr-1" />
      <span>Chat {id}</span>
    </button>
  );
}
