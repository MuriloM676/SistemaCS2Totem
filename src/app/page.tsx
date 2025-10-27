import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-8 text-gray-800">
          Sistema de Totem
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600">
          Posto de Saúde - Autoatendimento
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Link
            href="/cadastro"
            className="group rounded-lg border border-transparent px-5 py-12 transition-colors hover:border-blue-300 hover:bg-blue-100 bg-white shadow-lg"
          >
            <h2 className="mb-3 text-3xl font-semibold text-center">
              Cadastro{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80 text-center mx-auto">
              Interface para pacientes gerarem senhas de atendimento
            </p>
          </Link>

          <Link
            href="/guiche"
            className="group rounded-lg border border-transparent px-5 py-12 transition-colors hover:border-blue-300 hover:bg-blue-100 bg-white shadow-lg"
          >
            <h2 className="mb-3 text-3xl font-semibold text-center">
              Guichê{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80 text-center mx-auto">
              Área do atendente para chamar senhas
            </p>
          </Link>

          <Link
            href="/painel"
            className="group rounded-lg border border-transparent px-5 py-12 transition-colors hover:border-blue-300 hover:bg-blue-100 bg-white shadow-lg"
          >
            <h2 className="mb-3 text-3xl font-semibold text-center">
              Painel{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80 text-center mx-auto">
              Painel de chamadas para sala de espera
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
