import type { AccountLogoProps } from '../../types/interfaces';
import { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

export function AccountLogo({ user, logoutFunction }: AccountLogoProps) {
  const [showLogout, setShowLogout] = useState(false);
  const refDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (refDiv.current && !refDiv.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const showLogoutFunction = () => {
    setShowLogout(!showLogout);
  }

  return (
    <div onClick={showLogoutFunction} ref={refDiv} className="relative flex items-center justify-center cursor-pointer">
      <section className='flex flex-col text-end'>
        <span>{user.name}</span>
        <span className='text-sm text-textColor hidden sm:block'>{user.email}</span>
      </section>

      <img
        src={user.image || '/destello.png'}
        alt={user.name}
        className="w-10 h-10 rounded-full ml-4"
      />

      {/* <ArrowDown className="w-5 h-5 ml-2" /> */}
      {
        showLogout && (
          <button onClick={logoutFunction} className={`absolute flex justify-start items-center right-0 top-10 py-2 px-4 mt-4 w-auto bg-white border rounded-md z-10 transition-all duration-200 ease-in-out hover:bg-red-200 hover:text-red-700 hover:border-red-400 hover:shadow-lg ${showLogout ? 'animate-increaseHeight' : 'animate-decreaseHeight'}`}>
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </button>
        )
      }
    </div>
  );
}
