# Como Usar o Sistema

## 📱 Fluxo Completo de Atendimento

### 1. Paciente Gera Senha (Tablet - /cadastro)

1. Acesse: `http://localhost:3000/cadastro`
2. Preencha os dados:
   - **Nome completo** (mínimo 3 caracteres)
   - **CPF** (apenas números, 11 dígitos)
   - **Telefone** (apenas números, 10-11 dígitos)
3. Clique em **"Gerar Senha"**
4. A senha será exibida em destaque na tela
5. Paciente aguarda ser chamado

### 2. Atendente Gerencia Senhas (Desktop - /guiche)

1. Acesse: `http://localhost:3000/guiche`
2. Faça login:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
3. Visualize a lista de senhas aguardando
4. Clique em **"Chamar"** na senha desejada
5. A senha será chamada e aparecerá automaticamente no painel

### 3. Painel Exibe Senhas Chamadas (TV - /painel)

1. Acesse: `http://localhost:3000/painel` em uma TV ou monitor
2. O painel atualiza automaticamente quando uma senha é chamada
3. Exibe:
   - Senha atual em destaque (fonte gigante)
   - Nome do paciente
   - Últimas 6 senhas chamadas

---

## 🎨 Personalização

### Alterar Cores do Tema

Edite `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#1890ff', // Cor principal
        // ... outras variações
      },
    },
  },
},
```

### Modificar Tempo de Atualização

**Guichê** - Edite `src/app/guiche/page.tsx`:
```typescript
const interval = setInterval(carregarSenhas, 5000); // 5 segundos
```

**Painel** - Edite `src/app/painel/page.tsx`:
```typescript
const interval = setInterval(carregarSenhasChamadas, 3000); // 3 segundos
```

---

## 🔐 Gerenciamento de Usuários

### Adicionar Novo Usuário do Guichê

Execute no terminal:

```bash
npx prisma studio
```

1. Abra a tabela `usuarios`
2. Clique em "Add record"
3. Preencha:
   - `username`: nome de usuário
   - `senha`: use um hash bcrypt (veja abaixo)
   - `nome`: nome completo

### Gerar Hash de Senha

Execute no Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('suaSenha123', 10);
console.log(hash);
```

Ou crie um script `scripts/create-user.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  const hash = await bcrypt.hash('novaSenha123', 10);
  
  await prisma.usuario.create({
    data: {
      username: 'atendente1',
      senha: hash,
      nome: 'Atendente 1',
    },
  });
  
  console.log('Usuário criado com sucesso!');
}

createUser();
```

Execute:
```bash
npx tsx scripts/create-user.ts
```

---

## 📊 Consultas Úteis no Banco

### Ver Todas as Senhas de Hoje

```sql
SELECT s.numero, s.status, p.nome, s.criado_em
FROM senhas s
LEFT JOIN pacientes p ON s.paciente_id = p.id
WHERE DATE(s.criado_em) = CURDATE()
ORDER BY s.criado_em DESC;
```

### Total de Atendimentos por Dia

```sql
SELECT DATE(criado_em) as data, COUNT(*) as total
FROM senhas
GROUP BY DATE(criado_em)
ORDER BY data DESC;
```

### Pacientes Mais Frequentes

```sql
SELECT p.nome, p.cpf, COUNT(s.id) as total_atendimentos
FROM pacientes p
JOIN senhas s ON s.paciente_id = p.id
GROUP BY p.id
ORDER BY total_atendimentos DESC
LIMIT 10;
```

---

## 🖥️ Configuração para Produção

### 1. Variáveis de Ambiente

Crie um arquivo `.env.production`:

```env
DATABASE_URL="mysql://usuario:senha@servidor:3306/banco"
NEXTAUTH_SECRET="mude-para-um-secret-aleatorio-e-seguro"
NEXTAUTH_URL="https://seudominio.com"
NODE_ENV="production"
```

### 2. Build

```bash
npm run build
```

### 3. Iniciar em Produção

```bash
npm start
```

### 4. PM2 (Recomendado)

```bash
# Instale PM2
npm install -g pm2

# Inicie o app
pm2 start npm --name "totem" -- start

# Configure para iniciar automaticamente
pm2 startup
pm2 save
```

---

## 📱 Otimização para Tablets

### Modo Quiosque (Kiosk Mode)

Para tablets rodando Chrome/Chromium:

```bash
chromium-browser --kiosk --app=http://localhost:3000/cadastro
```

### Desabilitar Sleep/Bloqueio

**Android**:
1. Configurações → Tela → Tempo de Espera → Nunca
2. Use app "Stay Alive!" para manter tela sempre ligada

**iPad**:
1. Ajustes → Tela e Brilho → Bloqueio Automático → Nunca
2. Use "Modo de Acesso Guiado" para travar no app

---

## 🔧 Manutenção

### Limpar Senhas Antigas

Crie um cron job ou tarefa agendada:

```typescript
// scripts/cleanup-old-senhas.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

  await prisma.senha.deleteMany({
    where: {
      criadoEm: {
        lt: tresMesesAtras,
      },
    },
  });

  console.log('Senhas antigas removidas');
}

cleanup();
```

### Backup do Banco

```bash
# Backup
docker exec totem_mysql mysqldump -u totem -ptotem123 totem_db > backup.sql

# Restaurar
docker exec -i totem_mysql mysql -u totem -ptotem123 totem_db < backup.sql
```

---

## 🐛 Debug

### Logs do Docker

```bash
docker logs totem_mysql
```

### Logs do Next.js

O console do navegador mostra erros de WebSocket e requisições.

### Prisma Studio

Interface visual para debug do banco:

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555

---

## ⚡ Performance

### Cache de Consultas

Edite `src/lib/prisma.ts` para adicionar cache:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
}).$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = performance.now();
      const result = await query(args);
      const end = performance.now();
      console.log(`${model}.${operation} levou ${end - start}ms`);
      return result;
    },
  },
});
```

---

Para mais informações, consulte a [documentação principal](README.md).
