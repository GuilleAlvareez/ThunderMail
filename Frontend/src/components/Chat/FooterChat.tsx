import { ArrowUp } from "lucide-react";
import { useRef } from 'react';

export function FooterChat({ sendChatMessage, isDisabled }: { sendChatMessage: (prompt: string) => void, isDisabled?: boolean }) {
  const refInput = useRef<HTMLInputElement>(null)

  function handleSend() {
    if (isDisabled) return;
    
    const prompt = refInput.current?.value || '';

    if (prompt.trim()) {
      sendChatMessage(prompt);
      refInput.current!.value = '';
    }
  }

  return (
    <div className="flex justify-center items-center pt-4 px-2 lg:px-6">
      <div className="relative w-full lg:w-2/3">
        <input
          ref={refInput}
          type="text"
          placeholder="Type a message..."
          className="w-full bg-input rounded-full pl-6 pr-16 py-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isDisabled) {
              handleSend();
            }
          }}
          disabled={isDisabled}
        />

        <button
          onClick={handleSend}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black rounded-full p-1 text-white hover:bg-gray-800 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={isDisabled}
        >
          <ArrowUp className="w-6 h-6 stroke-2" />
        </button>
      </div>
    </div>
  );
}
