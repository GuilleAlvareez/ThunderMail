import { SideBar } from './components/SideBar/SideBar';
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
    <main className='h-screen flex gap-1 bg-bg'>
      <SideBar />
    
      <section className='h-full w-full p-5'>
        <div className='h-full w-full bg-white rounded-4xl shadow-lg'>

        </div>
      </section>
      {/* {user ? (
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      ) : (
        <button onClick={iniciarLoginConGoogle}>Iniciar sesión con Google</button>
      )} */}
    </main>
  );
}

export default App;
