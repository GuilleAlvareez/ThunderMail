interface AssistantMessageProps {
  message: string;
  onSendEmail?: (draftContent: string) => void;
}

export function AssistantMessage({ message, onSendEmail }: AssistantMessageProps) {
  const isDraft = message.includes('To:') && message.includes('Subject:') && message.includes('Content:');

  return (
    <div className="flex items-start gap-3 mb-4">
      <img
        src="/destello.png"
        alt="Assistant Logo"
        className="w-8 h-8 rounded-full mt-1"
      />
      <div className="flex-1">
        <div className="p-3 rounded-xl max-w-xl border border-border">
          <p className="text-black leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
        {isDraft && onSendEmail && (
          <button
            onClick={() => onSendEmail(message)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Enviar Email
          </button>
        )}
      </div>
    </div>
  );
}
