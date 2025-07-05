import { ArrowUp } from "lucide-react";

export function FooterChat() {
  return (
    <div className="flex justify-center items-center pt-4 px-6">
      <div className="relative w-2/3">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-input rounded-full pl-6 pr-16 py-3 outline-none"
        />

        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-black rounded-full p-1 text-white hover:bg-gray-800 transition">
          <ArrowUp className="w-6 h-6 stroke-2" />
        </button>
      </div>
    </div>
  );
}
