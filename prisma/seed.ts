import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário padrão para o guichê
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const usuario = await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      senha: hashedPassword,
      nome: 'Administrador',
    },
  });

  console.log('Usuário criado:', usuario);
  console.log('Username: admin');
  console.log('Senha: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
