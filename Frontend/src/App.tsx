import { useState } from 'react';
import { SideBar } from './components/SideBar/SideBar';
import { Header } from './components/Chat/Header';
import { ChatSection } from './components/Chat/ChatSection';
import { FooterChat } from './components/Chat/FooterChat';
import { useAuth } from './hooks/useAuth';
import { useChatContext } from './context/ChatContext';

function App() {
  const { user } = useAuth();
  const [emailStyle, setEmailStyle] = useState("formal");

  // Usar el contexto para obtener el estado y las funciones del chat
  const { messages, sendChatMessage, handleSendEmail, loading } = useChatContext();

  // La función de envío de mensajes ahora necesita el estilo
  const handleSendMessage = (prompt: string) => {
    sendChatMessage(prompt, emailStyle);
  };

  return (
    <main className="h-screen flex gap-1 bg-bg">
      <SideBar />

      <section className="h-full w-full p-5">
        <div className="h-full w-full grid grid-rows-[auto_1fr_auto] bg-white rounded-4xl p-7 shadow-lg overflow-hidden">
          <Header onStyleChange={setEmailStyle} />

          <div className="overflow-y-auto min-h-0 flex-1">
            <ChatSection
              messages={messages} 
              onSendEmail={(draftContent) => handleSendEmail(draftContent, user?.email || '')}
              loading={loading}
            />
          </div>

          <FooterChat sendChatMessage={handleSendMessage} userId={user?.id || ''} />
        </div>
      </section>
    </main>
  );
}

export default App;
