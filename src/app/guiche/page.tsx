'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';

interface Senha {
  id: number;
  numero: string;
  status: string;
  criadoEm: string;
  paciente?: {
    nome: string;
  };
}

export default function GuichePage() {
  const router = useRouter();
  const { emitSenhaChamada } = useSocket();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [senhas, setSenhas] = useState<Senha[]>([]);
  const [historico, setHistorico] = useState<Senha[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      carregarSenhas();
      carregarHistorico();
      const interval = setInterval(() => {
        carregarSenhas();
        carregarHistorico();
      }, 5000); // Atualiza a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        setAuthenticated(true);
        setLoginData({ username: '', password: '' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const carregarSenhas = async () => {
    try {
      const response = await fetch('/api/senhas?status=aguardando');
      const data = await response.json();
      if (data.success) {
        setSenhas(data.senhas);
      }
    } catch (err) {
      console.error('Erro ao carregar senhas:', err);
    }
  };

  const carregarHistorico = async () => {
    try {
      const response = await fetch('/api/senhas?status=finalizado&limit=10');
      const data = await response.json();
      if (data.success) {
        setHistorico(data.senhas);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    }
  };

  const chamarSenha = async (id: number) => {
    try {
      const response = await fetch(`/api/senhas/${id}/chamar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Emitir evento via WebSocket
        emitSenhaChamada(data.senha);
        carregarSenhas();
        carregarHistorico();
      }
    } catch (err) {
      console.error('Erro ao chamar senha:', err);
    }
  };

  const finalizarAtendimento = async (id: number) => {
    try {
      const response = await fetch(`/api/senhas/${id}/finalizar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        carregarSenhas();
        carregarHistorico();
      }
    } catch (err) {
      console.error('Erro ao finalizar atendimento:', err);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Login do Guichê
          </h1>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Usuário
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xl font-bold py-4 rounded-xl transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-semibold py-3 rounded-xl transition-colors"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciamento de Senhas
            </h1>
            <div className="space-x-4">
              <button
                onClick={carregarSenhas}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                ↻ Atualizar
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Senhas Aguardando ({senhas.length})
          </h2>

          {senhas.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xl">
              Nenhuma senha aguardando atendimento
            </div>
          ) : (
            <div className="grid gap-4">
              {senhas.map((senha) => (
                <div
                  key={senha.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                      <div className="bg-blue-600 text-white rounded-xl px-6 py-4">
                        <p className="text-4xl font-bold">{senha.numero}</p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-gray-800">
                          {senha.paciente?.nome || 'Sem nome'}
                        </p>
                        <p className="text-gray-500">
                          Aguardando desde{' '}
                          {new Date(senha.criadoEm).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => chamarSenha(senha.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-colors"
                    >
                      Chamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Histórico de Atendimentos
          </h2>

          {historico.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-lg">
              Nenhum atendimento finalizado ainda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Senha
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Paciente
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Criado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((senha) => (
                    <tr
                      key={senha.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <span className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                          {senha.numero}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-800">
                        {senha.paciente?.nome || 'Sem nome'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(senha.criadoEm).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Finalizado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
