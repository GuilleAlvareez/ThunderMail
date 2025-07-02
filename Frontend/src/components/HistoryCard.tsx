import { MessageCircle } from "lucide-react";

export function HistoryCard({ text }) {
  return (
    <button className="bg-transparent flex items-center justify-center w-fit border border-border rounded-md py-2 pl-3 pr-4 shadow transition-transform duration-100 ease-in-out active:scale-95">
      <MessageCircle className="w-6 h-6 stroke-1 mr-1" />
      <span>{text}</span>
    </button>
  );
}
