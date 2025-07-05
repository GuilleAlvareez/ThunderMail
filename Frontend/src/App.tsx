import { Header } from './components/Chat/Header';
import { SideBar } from './components/SideBar/SideBar';
import { FooterChat } from './components/Chat/FooterChat';
import { ChatSection } from './components/Chat/ChatSection';

function App() {
  return (
    <main className="h-screen flex gap-1 bg-bg">
      <SideBar />

      <section className="h-full w-full p-5">
        <div className="h-full w-full grid grid-rows-[auto_1fr_auto] bg-white rounded-4xl p-7 shadow-lg overflow-hidden">
          <Header />

          <div className="overflow-y-auto min-h-0">
            <ChatSection />
          </div>

          <FooterChat />
        </div>
      </section>
    </main>
  );
}

export default App;
