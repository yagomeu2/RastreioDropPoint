import { useState } from 'react';
import Header from './components/Header';
import GenerateTab from './components/GenerateTab';
import TrackingTab from './components/TrackingTab';

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'track'>('generate');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'generate' ? <GenerateTab /> : <TrackingTab />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} SHP EXPRESS - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
