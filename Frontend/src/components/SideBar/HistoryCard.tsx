import { MessageCircle, Trash2 } from "lucide-react";
import { useChatContext } from "../../context/ChatContext";

interface HistoryCardProps {
  id: number;
  title?: string;
  isActive: boolean;
  onClick: () => void;
}

export function HistoryCard({ id, title, isActive, onClick }: HistoryCardProps) {
  const { deleteChat } = useChatContext();
  
  const handleDeleteChat = () => {
    // Lógica para eliminar el chat
    deleteChat(id);
  };

  return (
    <button 
      className={`group bg-transparent w-full flex items-center justify-start border border-border rounded-md py-2 pl-3 pr-4 mb-2 shadow transition-all duration-100 ease-in-out hover:bg-hoverSidebar active:scale-95 ${
        isActive ? 'border-gradientText bg-hoverSidebar' : 'border-border'
      }`}
      onClick={onClick}
    >
      <MessageCircle className="w-6 h-6 stroke-1 mr-2 flex-shrink-0" />
      <div className="flex justify-between items-center w-full min-w-0">
        <span className="truncate pr-1">{title || `New Chat`}</span>
        <Trash2 onClick={handleDeleteChat} className="invisible group-hover:visible w-5 h-5 stroke-1 hover:text-red-700 flex-shrink-0" />
      </div>
    </button>
  );
}
