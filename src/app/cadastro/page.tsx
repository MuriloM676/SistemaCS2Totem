'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [senhaGerada, setSenhaGerada] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 11);
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 11);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSenhaGerada(data.senha);
        setFormData({ nome: '', cpf: '', telefone: '' });
      } else {
        setError(data.error || 'Erro ao gerar senha');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleNovaSenha = () => {
    setSenhaGerada(null);
    setError(null);
  };

  if (senhaGerada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Senha Gerada com Sucesso!
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              Sua senha de atendimento é:
            </p>
            <div className="bg-blue-600 text-white rounded-2xl py-12 px-8 mb-8">
              <p className="text-9xl font-bold">{senhaGerada}</p>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Aguarde ser chamado no painel
            </p>
          </div>
          <button
            onClick={handleNovaSenha}
            className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-6 px-12 rounded-2xl transition-colors w-full"
          >
            Gerar Nova Senha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-gray-800">
          Bem-vindo!
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12 text-gray-600">
          Preencha seus dados para gerar sua senha
        </p>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-2xl font-semibold mb-4 text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full px-6 py-6 text-2xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Digite seu nome completo"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-2xl font-semibold mb-4 text-gray-700">
              CPF
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: formatCPF(e.target.value) })
              }
              className="w-full px-6 py-6 text-2xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Digite apenas números"
              required
              disabled={loading}
              maxLength={11}
            />
            <p className="text-gray-500 mt-2 text-lg">
              {formData.cpf.length}/11 dígitos
            </p>
          </div>

          <div>
            <label className="block text-2xl font-semibold mb-4 text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  telefone: formatTelefone(e.target.value),
                })
              }
              className="w-full px-6 py-6 text-2xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Digite apenas números"
              required
              disabled={loading}
              maxLength={11}
            />
            <p className="text-gray-500 mt-2 text-lg">
              {formData.telefone.length}/11 dígitos
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-3xl font-bold py-8 px-6 rounded-2xl transition-colors shadow-lg"
          >
            {loading ? 'Gerando...' : 'Gerar Senha'}
          </button>
        </form>

        <button
          onClick={() => router.push('/')}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-semibold py-4 px-6 rounded-2xl transition-colors"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
