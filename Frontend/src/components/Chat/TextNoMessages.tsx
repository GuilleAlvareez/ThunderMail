export function TextNoMessages({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1">
      <div className="text-start text-gray-500 mt-8">
        <p className='text-5xl font-semibold bg-gradient-to-br from-gradientText to-gradientText2 bg-clip-text text-transparent mb-4'>Hello {name}</p>
        <p className='text-4xl font-semibold text-textNoChat'>How can i help you today?</p>
      </div>
    </div>
  );
}