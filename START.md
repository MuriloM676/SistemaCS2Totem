# 🎉 Sistema de Totem Criado com Sucesso!

## ✅ Tudo Pronto! Agora siga estes passos:

### 1️⃣ Instalar Dependências
```powershell
npm install
```

### 2️⃣ Iniciar o MySQL com Docker
```powershell
npm run docker:up
```
⏳ Aguarde 10-15 segundos para o MySQL inicializar

### 3️⃣ Criar as Tabelas do Banco
```powershell
npm run prisma:migrate
```
Quando solicitado, dê um nome para a migration (ex: "init")

### 4️⃣ Gerar o Cliente Prisma
```powershell
npm run prisma:generate
```

### 5️⃣ Popular o Banco (Criar usuário admin)
```powershell
npm run prisma:seed
```

### 6️⃣ Iniciar o Servidor
```powershell
npm run dev
```

### 7️⃣ Acessar o Sistema
Abra seu navegador em: **http://localhost:3000**

---

## 🔑 Credenciais de Acesso

**Guichê (/guiche)**
- Usuário: `admin`
- Senha: `admin123`

---

## 📱 Testar o Sistema

### Teste 1: Gerar uma Senha
1. Acesse: http://localhost:3000/cadastro
2. Preencha: Nome, CPF (11 dígitos), Telefone
3. Clique em "Gerar Senha"
4. Uma senha será exibida (ex: 001)

### Teste 2: Chamar a Senha
1. Acesse: http://localhost:3000/guiche
2. Faça login (admin/admin123)
3. Clique em "Chamar" na senha
4. A senha mudará de status

### Teste 3: Ver no Painel
1. Abra outra aba: http://localhost:3000/painel
2. A senha chamada aparecerá automaticamente
3. Teste chamar outra senha no guichê e veja atualizar em tempo real!

---

## 📚 Documentação

- **README.md** - Documentação completa do projeto
- **INSTALL.md** - Guia de instalação detalhado
- **USAGE.md** - Como usar o sistema em produção

---

## 🆘 Problemas?

### MySQL não inicia
```powershell
docker ps  # Verificar se está rodando
npm run docker:down
npm run docker:up
```

### Erro no Prisma
```powershell
npm run prisma:generate
```

### Porta 3000 ocupada
```powershell
# Use outra porta
$env:PORT=3001; npm run dev
```

---

## 🎯 Estrutura do Projeto

```
SistemaCS2Totem/
├── 📱 src/app/cadastro/    → Interface Tablet (pacientes)
├── 💻 src/app/guiche/      → Interface Atendente
├── 📺 src/app/painel/      → Painel Sala de Espera
├── 🔌 src/app/api/         → APIs REST
├── 🗄️ prisma/              → Banco de dados
└── 🐳 docker-compose.yml   → MySQL container
```

---

## 🚀 Comando Rápido (All-in-One)

Se preferir fazer tudo de uma vez:

```powershell
npm install; npm run docker:up; Start-Sleep -Seconds 10; npm run prisma:migrate; npm run prisma:generate; npm run prisma:seed; npm run dev
```

---

**🎊 Parabéns! Seu sistema de totem está pronto para uso!**

Desenvolvido com ❤️ usando Next.js + TypeScript + Tailwind + Prisma + MySQL
