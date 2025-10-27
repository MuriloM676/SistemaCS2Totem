# Sistema de Totem para Posto de Saúde

Sistema completo de autoatendimento para posto de saúde desenvolvido com Next.js 14, TypeScript, Tailwind CSS, Prisma ORM e MySQL.

## 📋 Características

- **Interface de Cadastro (/cadastro)**: Tela otimizada para tablet com botões grandes e acessíveis
- **Interface do Guichê (/guiche)**: Área do atendente com login seguro e gerenciamento de senhas
- **Painel de Chamadas (/painel)**: Exibição em tela cheia para sala de espera com atualização em tempo real
- **WebSocket**: Comunicação em tempo real entre guichê e painel
- **Banco de Dados MySQL**: Rodando em container Docker
- **Design Responsivo**: Otimizado para diferentes tamanhos de tela

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **MySQL 8.0**
- **Socket.IO**
- **Docker & Docker Compose**
- **bcryptjs** (Autenticação)
- **Zod** (Validação)

## 📦 Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MuriloM676/SistemaCS2Totem.git
cd SistemaCS2Totem
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

O arquivo `.env` já está configurado com valores padrão para desenvolvimento local.

### 4. Inicie o banco de dados MySQL com Docker

```bash
npm run docker:up
```

Aguarde alguns segundos para o MySQL inicializar completamente.

### 5. Execute as migrations do Prisma

```bash
npm run prisma:migrate
```

Quando solicitado, forneça um nome para a migration (ex: "init").

### 6. Gere o cliente Prisma

```bash
npm run prisma:generate
```

### 7. Popule o banco com dados iniciais (seed)

```bash
npx tsx prisma/seed.ts
```

Isso criará um usuário administrador:
- **Usuário**: admin
- **Senha**: admin123

## 🎯 Uso

### Executar em modo desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Compilar para produção

```bash
npm run build
npm start
```

## 📱 Rotas da Aplicação

### Página Inicial
- **URL**: `/`
- **Descrição**: Menu principal com links para todas as interfaces

### Cadastro (Tablet)
- **URL**: `/cadastro`
- **Descrição**: Interface para pacientes gerarem senhas de atendimento
- **Campos**: Nome completo, CPF (11 dígitos), Telefone (10-11 dígitos)
- **Características**:
  - Botões grandes e acessíveis
  - Validação de dados em tempo real
  - Exibição da senha gerada em destaque

### Guichê (Atendente)
- **URL**: `/guiche`
- **Descrição**: Área do atendente para gerenciar senhas
- **Login**:
  - Usuário: `admin`
  - Senha: `admin123`
- **Funcionalidades**:
  - Visualizar lista de senhas aguardando
  - Chamar próxima senha
  - Atualização automática a cada 5 segundos

### Painel (Sala de Espera)
- **URL**: `/painel`
- **Descrição**: Painel de exibição para sala de espera
- **Características**:
  - Tela cheia otimizada
  - Fontes grandes e legíveis
  - Atualização em tempo real via WebSocket
  - Exibe senha atual em destaque
  - Lista das últimas senhas chamadas

## 🗄️ Estrutura do Banco de Dados

### Tabela: `pacientes`
- `id` (INT, PK, AUTO_INCREMENT)
- `nome` (VARCHAR 255)
- `cpf` (VARCHAR 11, UNIQUE)
- `telefone` (VARCHAR 15)
- `criado_em` (DATETIME)

### Tabela: `senhas`
- `id` (INT, PK, AUTO_INCREMENT)
- `numero` (VARCHAR 10, UNIQUE)
- `status` (VARCHAR 20) - Valores: `aguardando`, `chamando`, `atendido`
- `criado_em` (DATETIME)
- `chamado_em` (DATETIME, NULL)
- `paciente_id` (INT, FK, NULL)

### Tabela: `usuarios`
- `id` (INT, PK, AUTO_INCREMENT)
- `username` (VARCHAR 50, UNIQUE)
- `senha` (VARCHAR 255) - Hash bcrypt
- `nome` (VARCHAR 255)
- `criado_em` (DATETIME)

## 🔌 API Endpoints

### POST `/api/cadastro`
Cria novo paciente e gera senha de atendimento.

**Body**:
```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "11987654321"
}
```

**Response**:
```json
{
  "success": true,
  "senha": "001",
  "paciente": {
    "nome": "João Silva"
  }
}
```

### GET `/api/senhas?status=aguardando`
Lista senhas por status.

**Query Params**:
- `status`: `aguardando`, `chamando`, ou `atendido`

### POST `/api/senhas/:id/chamar`
Marca senha como "chamando" e emite evento WebSocket.

### POST `/api/senhas/:id/finalizar`
Marca senha como "atendido".

### POST `/api/auth/login`
Autentica usuário do guichê.

**Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

## 🔒 Segurança

- Senhas de usuários armazenadas com hash bcrypt
- Validação de dados com Zod
- Relacionamento opcional entre senhas e pacientes (permite exclusão de pacientes sem afetar histórico de senhas)

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Prisma
npm run prisma:generate   # Gera cliente Prisma
npm run prisma:migrate    # Cria/aplica migrations
npm run prisma:studio     # Abre interface visual do banco

# Docker
npm run docker:up         # Inicia containers
npm run docker:down       # Para containers

# Setup completo
npm run setup            # Instala deps, inicia Docker, roda migrations
```

## 📝 Notas de Desenvolvimento

### Numeração de Senhas
- As senhas são numeradas sequencialmente a cada dia
- Formato: 001, 002, 003, etc.
- Contador reinicia automaticamente à meia-noite

### WebSocket
- Implementado com Socket.IO
- Evento principal: `senha-chamada`
- Atualização automática do painel quando senha é chamada no guichê

### Responsividade
- Mobile-first design
- Breakpoints otimizados para tablets e desktops
- Interface de cadastro especialmente otimizada para tablets de 10"

## 🚀 Próximas Melhorias

- [ ] Sistema de autenticação com NextAuth
- [ ] Histórico completo de atendimentos
- [ ] Relatórios e estatísticas
- [ ] Notificações sonoras no painel
- [ ] Múltiplos guichês simultâneos
- [ ] Impressão de senhas
- [ ] Testes automatizados
- [ ] Deploy em produção

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 👨‍💻 Autor

Desenvolvido por **Murilo M676**

---

**Última atualização**: Outubro 2025
