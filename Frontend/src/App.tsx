import { useState, useEffect } from 'react';
import { Menu, Settings } from 'lucide-react';
import { SideBar } from './components/SideBar/SideBar';
import { Header } from './components/Chat/Header';
import { ChatSection } from './components/Chat/ChatSection';
import { FooterChat } from './components/Chat/FooterChat';
import { AuthModal } from './components/Modals/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useChatContext } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  const { user } = useAuth();
  const [emailStyle, setEmailStyle] = useState("formal");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Usar el contexto para obtener el estado y las funciones del chat
  const { messages, sendChatMessage, handleSendEmail, loading, sendingEmail } = useChatContext();

  // La función de envío de mensajes ahora verifica autenticación
  const handleSendMessage = (prompt: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    sendChatMessage(prompt, emailStyle);
  };



  function handleStyleChange(value: string) {
    // Crear los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    params.set("style", value); // Usar set en lugar de append para evitar duplicados

    // Actualizar la URL sin recargar la página
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newURL);

    setEmailStyle(value);
  }

  useEffect(() => {
    // Obtener el parámetro "style" de la URL
    const params = new URLSearchParams(window.location.search);
    const style = params.get("style") || "formal";
    setEmailStyle(style);
  }, [])

  return (
    <main className="h-screen flex gap-1 bg-bg">
      {/* Sidebar con panel deslizable para móviles */}
      <div className={`fixed inset-y-0 left-0 z-30 w-4/5 max-w-sm bg-bg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:inset-auto lg:w-1/6`}>
        <SideBar />
      </div>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="h-full w-full p-2 lg:p-5">
        <div className="h-full w-full grid grid-rows-[auto_1fr_auto] bg-white rounded-4xl p-3 lg:p-7 shadow-lg overflow-hidden">
          {/* Cabecera específica para móviles */}
          <div className="flex items-center justify-between p-2 lg:hidden relative">
            <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen(true)} className="p-2">
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative">
                <Select value={emailStyle} onValueChange={handleStyleChange}>
                  <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-gray-100 rounded-md">
                    <Settings className="w-6 h-6" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Header onStyleChange={handleStyleChange} />
          </div>

          {/* Header original - solo visible en pantallas grandes */}
          <div className="hidden lg:flex justify-between items-center mb-4">
            {/* Selector de estilo para pantallas grandes */}
            <Select value={emailStyle} onValueChange={handleStyleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
              </SelectContent>
            </Select>

            {/* Información del usuario */}
            <Header onStyleChange={handleStyleChange} />
          </div>

          <div className="overflow-y-auto min-h-0 flex-1 px-2 lg:px-0">
            <ChatSection
              messages={messages}
              onSendEmail={(draftContent) => handleSendEmail(draftContent, user?.email || '')}
              loading={loading}
              sendingEmail={sendingEmail}
            />
          </div>

          <div className="px-2 lg:px-0">
            <FooterChat
              sendChatMessage={handleSendMessage}
              userId={user?.id || ''}
              isDisabled={sendingEmail}
            />
          </div>
        </div>
      </section>

      {/* Modal de autenticación */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <ToastContainer />
    </main>
  );
}

export default App;
