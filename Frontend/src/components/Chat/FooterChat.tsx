import { ArrowUp } from "lucide-react";
import { useRef } from 'react';

export function FooterChat({ sendChatMessage, userId }: { sendChatMessage: (prompt: string, userId: string) => void, userId: string }) {
  const refInput = useRef<HTMLInputElement>(null)

  function handleSend() {
    const prompt = refInput.current?.value || '';

    if (prompt.trim()) {
      sendChatMessage(prompt, userId);
      refInput.current!.value = '';
    }
  }

  return (
    <div className="flex justify-center items-center pt-4 px-6">
      <div className="relative w-2/3">
        <input
          ref={refInput}
          type="text"
          placeholder="Type a message..."
          className="w-full bg-input rounded-full pl-6 pr-16 py-3 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        
        <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black rounded-full p-1 text-white hover:bg-gray-800 transition">
          <ArrowUp className="w-6 h-6 stroke-2" />
        </button>
      </div>
    </div>
  );
}
