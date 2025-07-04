import { useAuth } from "../../hooks/useAuth";
import { AccountLogo } from "./AccountLogo";
import { LoginButton } from './LoginButton';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export function Header() {
  const { user, loading, handleLogin, handleLogout } = useAuth();
    
    function loginWithGoogle() {
        handleLogin();
      }
    
      async function logoutSession() {
        try {
          await handleLogout();
          console.log('Logout exitoso. Redirigiendo...');
          window.location.href = '/';
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      }

      console.log(user);

  return (
    <div className=" flex justify-end">
      {user ? (
        <div className="group">
          <AccountLogo user={user as User} logoutFunction={logoutSession} />
        </div>

      ) : (
        <LoginButton loginFunction={loginWithGoogle} />
      )}

    </div>
 )
}