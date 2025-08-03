export function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-end gap-3 mb-4 mr-1">
      <div className="bg-[#E9E6F5] p-3 mt-3 rounded-xl max-w-xl tansition-all duration-200 ease-in-out shadow-bubbleShadow ">
        <p className="text-[#1F2937] leading-relaxed">
          {message}
        </p>
      </div>

      {/* <img
        src="/destello.png"
        alt="Assistant Logo"
        className="w-8 h-8 rounded-full mt-1"
      /> */}
    </div>
  );
}