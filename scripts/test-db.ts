import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n');

    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Contar registros
    const pacientesCount = await prisma.paciente.count();
    const senhasCount = await prisma.senha.count();
    const usuariosCount = await prisma.usuario.count();

    console.log('📊 Estatísticas do Banco de Dados:');
    console.log(`   - Pacientes: ${pacientesCount}`);
    console.log(`   - Senhas: ${senhasCount}`);
    console.log(`   - Usuários: ${usuariosCount}\n`);

    // Listar usuários (sem mostrar senha)
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        criadoEm: true,
      },
    });

    console.log('👤 Usuários cadastrados:');
    usuarios.forEach((user) => {
      console.log(`   - ${user.nome} (@${user.username})`);
    });

    console.log('\n✨ Tudo funcionando perfeitamente!');
    console.log('\n🚀 Próximo passo: npm run dev\n');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
    console.log('\n💡 Verifique se:');
    console.log('   1. O Docker está rodando (npm run docker:up)');
    console.log('   2. As migrations foram executadas (npm run prisma:migrate)');
    console.log('   3. O cliente foi gerado (npm run prisma:generate)\n');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
