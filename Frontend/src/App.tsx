import { useEffect, useState } from 'react';
import { authClient } from './utils/auth-client';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function iniciarLoginConGoogle() {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.error) return;

          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  async function cerrarSesion() {
    try {
      await authClient.signOut();
      setUser(null);
      console.log('Logout exitoso. Redirigiendo...');
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {user ? (
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      ) : (
        <button onClick={iniciarLoginConGoogle}>Iniciar sesión con Google</button>
      )}
    </>
  );
}

export default App;
