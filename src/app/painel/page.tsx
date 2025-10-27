'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface SenhaChamada {
  id: number;
  numero: string;
  paciente?: {
    nome: string;
  };
  chamadoEm: string;
}

export default function PainelPage() {
  const { onSenhaChamada, offSenhaChamada } = useSocket();
  const [senhasChamadas, setSenhasChamadas] = useState<SenhaChamada[]>([]);
  const [ultimaSenha, setUltimaSenha] = useState<SenhaChamada | null>(null);

  useEffect(() => {
    carregarSenhasChamadas();
    const interval = setInterval(carregarSenhasChamadas, 3000);

    // Listener para WebSocket
    onSenhaChamada((senha: SenhaChamada) => {
      console.log('Nova senha chamada via WebSocket:', senha);
      setUltimaSenha(senha);
      setSenhasChamadas((prev) => [senha, ...prev.slice(0, 5)]);
    });

    return () => {
      clearInterval(interval);
      offSenhaChamada();
    };
  }, []);

  const carregarSenhasChamadas = async () => {
    try {
      const response = await fetch('/api/senhas?status=chamando');
      const data = await response.json();
      
      if (data.success && data.senhas.length > 0) {
        setSenhasChamadas(data.senhas);
        
        // Pega a senha mais recentemente chamada
        const maisRecente = data.senhas.reduce((prev: SenhaChamada, current: SenhaChamada) => {
          return new Date(current.chamadoEm) > new Date(prev.chamadoEm) ? current : prev;
        });
        
        setUltimaSenha(maisRecente);
      }
    } catch (err) {
      console.error('Erro ao carregar senhas chamadas:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      {/* Header */}
      <div className="bg-blue-800 shadow-2xl py-8 px-12">
        <h1 className="text-6xl font-bold text-center">
          Painel de Senhas - Posto de Saúde
        </h1>
        <p className="text-2xl text-center mt-4 text-blue-200">
          Aguarde ser chamado
        </p>
      </div>

      {/* Senha Atual em Destaque */}
      {ultimaSenha && (
        <div className="container mx-auto px-12 py-16">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-16 mb-12 animate-pulse">
            <p className="text-4xl font-semibold text-center mb-8 text-gray-600">
              SENHA CHAMADA
            </p>
            <div className="text-center">
              <p className="text-[12rem] font-bold text-blue-600 leading-none mb-8">
                {ultimaSenha.numero}
              </p>
              <div className="bg-blue-50 rounded-2xl py-8 px-12">
                <p className="text-5xl font-semibold text-gray-800">
                  {ultimaSenha.paciente?.nome || 'Paciente'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Senhas Recentes */}
      {senhasChamadas.length > 1 && (
        <div className="container mx-auto px-12 pb-16">
          <h2 className="text-4xl font-bold text-center mb-8">
            Últimas Senhas Chamadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {senhasChamadas
              .filter((s) => s.id !== ultimaSenha?.id)
              .slice(0, 6)
              .map((senha) => (
                <div
                  key={senha.id}
                  className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 text-center"
                >
                  <p className="text-7xl font-bold mb-4">{senha.numero}</p>
                  <p className="text-2xl">
                    {senha.paciente?.nome || 'Paciente'}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há senhas */}
      {senhasChamadas.length === 0 && (
        <div className="container mx-auto px-12 py-32 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-16">
            <svg
              className="w-32 h-32 mx-auto mb-8 text-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-5xl font-semibold">
              Aguardando chamadas...
            </p>
            <p className="text-3xl mt-6 text-blue-200">
              Nenhuma senha foi chamada ainda
            </p>
          </div>
        </div>
      )}

      {/* Footer com hora */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-800 py-6 px-12">
        <p className="text-3xl text-center font-semibold">
          {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
