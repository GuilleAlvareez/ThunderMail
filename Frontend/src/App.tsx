import './App.css'
import { authClient } from './utils/auth-client'
function App() {

  function iniciarLoginConGoogle() {
    // Esta función llamará a tu backend, que luego redirigirá a Google.
    authClient.signIn.social({
      provider: "google",
      // Opcional: a dónde redirigir al usuario después de un login exitoso.
      callbackURL: "/" 
    });
  }

  function cerrarSesion() {
    authClient.signOut();
    console.log("Logout exitoso. Redirigiendo...");
    window.location.href = '/';
  }

  return (
    <>
      <button onClick={iniciarLoginConGoogle}>
        Iniciar sesión con Google
      </button>
      <button onClick={cerrarSesion}>
        Cerrar sesion
      </button>

      
    </>
  )
}

export default App
