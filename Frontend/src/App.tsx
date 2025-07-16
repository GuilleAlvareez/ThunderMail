import { Header } from './components/Chat/Header';
import { SideBar } from './components/SideBar/SideBar';
import { FooterChat } from './components/Chat/FooterChat';
import { ChatSection } from './components/Chat/ChatSection';
import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';

function App() {
  const [prompt, setPrompt] = useState('');
  const activeChatId = 1;
  const { user } = useAuth();
  const { messages, sendChatMessage, handleSendEmail, loading } = useChat(user?.id);
    console.log("prompt", prompt);

  return (
    <main className="h-screen flex gap-1 bg-bg">
      <SideBar />

      <section className="h-full w-full p-5">
        <div className="h-full w-full grid grid-rows-[auto_1fr_auto] bg-white rounded-4xl p-7 shadow-lg overflow-hidden">
          <Header />

          <div className="overflow-y-auto min-h-0 flex-1">
            <ChatSection
              messages={messages} 
              onSendEmail={handleSendEmail}
              loading={loading}
            />
          </div>

          <FooterChat sendChatMessage={sendChatMessage} userId={user?.id} />
        </div>
      </section>
    </main>
  );
}

export default App;