export function LoadingAccount() {
  return (
    <div className="flex items-center justify-center">
      <section className='flex flex-col items-end'>
        <span className="h-4 w-25 bg-gray-300 mb-1 animate-pulse"/>
        <span className='h-4 w-50 bg-gray-300 animate-pulse' />
      </section>

      <div className="w-10 h-10 rounded-full ml-4 bg-gray-300 animate-pulse"/>
    </div>
  );
}