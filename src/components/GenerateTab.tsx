import { useState } from 'react';
import { Plus, Trash2, Download, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateTrackingCode } from '../utils/generateCode';

interface BatchItem {
  id: string;
  suffix: 'F' | 'T' | 'M';
  account: string;
  realTrackingCode: string;
  generatedCode?: string;
}

export default function GenerateTab() {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    { id: crypto.randomUUID(), suffix: 'F', account: '', realTrackingCode: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addItem = () => {
    setBatchItems([
      ...batchItems,
      { id: crypto.randomUUID(), suffix: 'F', account: '', realTrackingCode: '' },
    ]);
  };

  const removeItem = (id: string) => {
    if (batchItems.length > 1) {
      setBatchItems(batchItems.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BatchItem, value: string) => {
    setBatchItems(
      batchItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const generateCodes = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const itemsWithCodes = batchItems.map((item) => ({
        ...item,
        generatedCode: generateTrackingCode(item.suffix),
      }));

      const { error } = await supabase.from('tracking_codes').insert(
        itemsWithCodes.map((item) => ({
          code: item.generatedCode!,
          account: item.account || null,
          real_tracking_code: item.realTrackingCode || null,
          status: 'created',
        }))
      );

      if (error) throw error;

      setBatchItems(itemsWithCodes);
      setSuccess(true);
    } catch (error) {
      console.error('Error generating codes:', error);
      alert('Erro ao gerar códigos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Código Gerado', 'Sufixo', 'Conta', 'Código Real'],
      ...batchItems.map((item) => [
        item.generatedCode || '',
        item.suffix,
        item.account,
        item.realTrackingCode,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shp-express-${Date.now()}.csv`;
    a.click();
  };

  const resetForm = () => {
    setBatchItems([
      { id: crypto.randomUUID(), suffix: 'F', account: '', realTrackingCode: '' },
    ]);
    setSuccess(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gerar Códigos de Rastreio
        </h2>
        {success && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Códigos gerados com sucesso!</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {batchItems.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="md:col-span-1 flex items-center">
              <span className="text-sm font-medium text-gray-600">
                #{index + 1}
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sufixo
              </label>
              <select
                value={item.suffix}
                onChange={(e) =>
                  updateItem(item.id, 'suffix', e.target.value)
                }
                disabled={loading || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="F">F</option>
                <option value="T">T</option>
                <option value="M">M</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta (opcional)
              </label>
              <input
                type="text"
                value={item.account}
                onChange={(e) =>
                  updateItem(item.id, 'account', e.target.value)
                }
                disabled={loading || success}
                placeholder="Nome da conta"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Real (opcional)
              </label>
              <input
                type="text"
                value={item.realTrackingCode}
                onChange={(e) =>
                  updateItem(item.id, 'realTrackingCode', e.target.value)
                }
                disabled={loading || success}
                placeholder="Código de rastreio real"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Gerado
              </label>
              <input
                type="text"
                value={item.generatedCode || ''}
                disabled
                placeholder="BR000000000000X"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 font-mono text-sm"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <button
                onClick={() => removeItem(item.id)}
                disabled={batchItems.length === 1 || loading || success}
                className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={addItem}
          disabled={loading || success}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Item</span>
        </button>

        {!success && (
          <button
            onClick={generateCodes}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{loading ? 'Gerando...' : 'Gerar Códigos'}</span>
          </button>
        )}

        {success && (
          <>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={resetForm}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Geração</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
