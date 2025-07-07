export function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start justify-end gap-3 mb-4">
      <div className="b p-3 mt-3 rounded-xl max-w-xl border border-gradientText hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-black leading-relaxed">
          {message}
        </p>
      </div>

      <img
        src="/destello.png"
        alt="Assistant Logo"
        className="w-8 h-8 rounded-full mt-1"
      />
    </div>
  );
}