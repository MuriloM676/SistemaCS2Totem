# Guia de Instalação Rápida

## Windows (PowerShell)

### 1. Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))

### 2. Instalação Automática

```powershell
# Clone o repositório
git clone https://github.com/MuriloM676/SistemaCS2Totem.git
cd SistemaCS2Totem

# Execute o setup completo
npm run setup
```

### 3. Iniciar o servidor

```powershell
npm run dev
```

Acesse: http://localhost:3000

## Linux/macOS (Bash)

### 1. Pré-requisitos
- Node.js 18+
- Docker & Docker Compose

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/MuriloM676/SistemaCS2Totem.git
cd SistemaCS2Totem

# Instale as dependências
npm install

# Inicie o Docker
npm run docker:up

# Aguarde 10 segundos e execute as migrations
sleep 10
npm run prisma:migrate
npm run prisma:generate

# Popular banco com usuário admin
npm run prisma:seed
```

### 3. Iniciar o servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Credenciais Padrão

**Guichê (/guiche)**
- Usuário: `admin`
- Senha: `admin123`

---

## Solução de Problemas

### Erro de conexão com MySQL

1. Verifique se o Docker está rodando:
```bash
docker ps
```

2. Reinicie o container:
```bash
npm run docker:down
npm run docker:up
```

### Erro no Prisma

Regenere o cliente:
```bash
npm run prisma:generate
```

### Porta 3000 em uso

Altere a porta no comando:
```bash
PORT=3001 npm run dev
```

---

## Estrutura de Pastas

```
SistemaCS2Totem/
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── app/
│   │   ├── cadastro/      # Interface tablet
│   │   ├── guiche/        # Interface atendente
│   │   ├── painel/        # Painel sala de espera
│   │   └── api/           # Endpoints REST
│   ├── hooks/
│   │   └── useSocket.ts   # WebSocket hook
│   └── lib/
│       ├── prisma.ts      # Cliente Prisma
│       └── socket.ts      # Configuração Socket.IO
├── docker-compose.yml     # Configuração Docker
└── package.json
```

---

Para mais detalhes, consulte o [README.md](README.md)
