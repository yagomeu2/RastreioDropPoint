import { useState } from 'react';
import { Search, Package, Calendar, User, Hash } from 'lucide-react';
import { supabase, TrackingCode } from '../lib/supabase';

export default function TrackingTab() {
  const [searchCode, setSearchCode] = useState('');
  const [tracking, setTracking] = useState<TrackingCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchTracking = async () => {
    if (!searchCode.trim()) return;

    setLoading(true);
    setNotFound(false);
    setTracking(null);

    try {
      const { data, error } = await supabase
        .from('tracking_codes')
        .select('*')
        .eq('code', searchCode.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTracking(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching tracking code:', error);
      alert('Erro ao buscar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchTracking();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      created: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      created: 'Criado',
      in_transit: 'Em Trânsito',
      delivered: 'Entregue',
      returned: 'Devolvido',
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Rastreamento de Encomendas
      </h2>

      <div className="flex gap-3 mb-8">
        <div className="flex-1">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Digite o código de rastreio (ex: BR123456789012F)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
        <button
          onClick={searchTracking}
          disabled={loading || !searchCode.trim()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Search className="w-5 h-5" />
          <span>{loading ? 'Buscando...' : 'Buscar'}</span>
        </button>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Código não encontrado
          </h3>
          <p className="text-red-600">
            O código <span className="font-mono font-bold">{searchCode}</span> não
            foi encontrado no sistema.
          </p>
        </div>
      )}

      {tracking && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Código de Rastreio</p>
                <p className="text-2xl font-bold text-gray-800 font-mono">
                  {tracking.code}
                </p>
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    tracking.status
                  )}`}
                >
                  {getStatusText(tracking.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {tracking.account && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Conta</p>
                  <p className="text-lg font-medium text-gray-800">
                    {tracking.account}
                  </p>
                </div>
              </div>
            )}

            {tracking.real_tracking_code && (
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Código de Rastreio Real</p>
                  <p className="text-lg font-medium text-gray-800 font-mono">
                    {tracking.real_tracking_code}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Data de Criação</p>
                <p className="text-lg font-medium text-gray-800">
                  {formatDate(tracking.created_at)}
                </p>
              </div>
            </div>

            {tracking.updated_at !== tracking.created_at && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Última Atualização</p>
                  <p className="text-lg font-medium text-gray-800">
                    {formatDate(tracking.updated_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!tracking && !notFound && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Digite um código de rastreio para começar a busca
          </p>
        </div>
      )}
    </div>
  );
}
