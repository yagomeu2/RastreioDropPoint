import { Package, Search, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generate' | 'track';
  onTabChange: (tab: 'generate' | 'track') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">SHP EXPRESS</h1>
              <p className="text-blue-100 text-sm">Sistema de Rastreamento</p>
            </div>
          </div>
        </div>

        <nav className="flex space-x-2">
          <button
            onClick={() => onTabChange('generate')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-white text-blue-700 shadow-md'
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Gerar Códigos</span>
          </button>

          <button
            onClick={() => onTabChange('track')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'track'
                ? 'bg-white text-blue-700 shadow-md'
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Rastreamento</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
