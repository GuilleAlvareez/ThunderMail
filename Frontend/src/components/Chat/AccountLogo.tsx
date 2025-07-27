import type { AccountLogoProps } from '../../types/interfaces';

export function AccountLogo({ user }: AccountLogoProps) {
  return (
    <div className="flex items-center justify-center">
      <section className='flex flex-col text-end'>
        <span>{user.name}</span>
        <span className='text-sm text-textColor'>{user.email}</span>
      </section>

      <img
        src={user.image}
        alt={user.name}
        className="w-10 h-10 rounded-full ml-4"
      />
    </div>
  );
}
