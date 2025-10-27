import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dataNascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data de nascimento deve estar no formato DD/MM/AAAA'),
});

// Função para gerar número de senha sequencial
async function gerarNumeroSenha(): Promise<string> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const count = await prisma.senha.count({
    where: {
      criadoEm: {
        gte: hoje,
      },
    },
  });

  const numero = (count + 1).toString().padStart(3, '0');
  return numero;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = cadastroSchema.parse(body);

    // Criar novo paciente
    const paciente = await prisma.paciente.create({
      data: validatedData,
    });

    // Gerar nova senha
    const numeroSenha = await gerarNumeroSenha();
    
    const senha = await prisma.senha.create({
      data: {
        numero: numeroSenha,
        pacienteId: paciente.id,
        status: 'aguardando',
      },
      include: {
        paciente: true,
      },
    });

    return NextResponse.json({
      success: true,
      senha: senha.numero,
      paciente: {
        nome: paciente.nome,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Erro ao criar senha:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar cadastro' },
      { status: 500 }
    );
  }
}
