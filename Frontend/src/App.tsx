import { Header } from './components/Chat/Header';
import { SideBar } from './components/SideBar/SideBar';
import { useAuth } from './hooks/useAuth';


function App() {
  return (
    <main className='h-screen flex gap-1 bg-bg'>
      <SideBar />
    
      <section className='h-full w-full p-5'>
        <div className='h-full w-full bg-white rounded-4xl p-7 shadow-lg'>
          <Header />
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
