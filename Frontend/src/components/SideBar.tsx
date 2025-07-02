import { useAuth } from '../hooks/useAuth';
import { HistoryCard } from './HistoryCard';

export function SideBar() {
  const { user, loading, handleLogin, handleLogout } = useAuth();

  function iniciarLoginConGoogle() {
    handleLogin();
  }

  async function cerrarSesion() {
    try {
      await handleLogout();
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
    <div className="flex flex-col h-screen w-screen p-3 bg-bg">
      <HistoryCard />
      {user ? (
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      ) : (
        <button onClick={iniciarLoginConGoogle}>Iniciar sesión con Google</button>
      )}
    </div>
  );
}