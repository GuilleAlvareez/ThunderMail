import { useAuth } from './hooks/useAuth';

function App() {
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
