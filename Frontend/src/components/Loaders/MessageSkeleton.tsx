export function UserMessageSkeleton() {
  return (
    <div className="flex items-center justify-end gap-3 mb-4 mr-5">
      <div className="p-3 mt-3 rounded-xl max-w-xl border border-gray-200">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mt-1"></div>
    </div>
  );
}

export function AssistantMessageSkeleton() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mt-1"></div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-xl max-w-xl px-4 py-3 border border-gray-200">
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded-xl animate-pulse w-32"></div>
            <div className="h-9 bg-gray-200 rounded-xl animate-pulse w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}