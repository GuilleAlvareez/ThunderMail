interface AssistantMessageProps {
  message: string;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <img
        src="/destello.png"
        alt="Assistant Logo"
        className="w-8 h-8 rounded-full mt-1"
      />
      <div className="p-3 rounded-xl max-w-xl border border-border">
        <p className="text-black leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}