import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dataNascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data de nascimento deve estar no formato DD/MM/AAAA'),
});

// Função para validar data de nascimento
function validarDataNascimento(dataStr: string): { valida: boolean; erro?: string } {
  const [dia, mes, ano] = dataStr.split('/').map(Number);
  
  // Verificar valores básicos
  if (mes < 1 || mes > 12) {
    return { valida: false, erro: 'Mês inválido' };
  }
  
  if (dia < 1 || dia > 31) {
    return { valida: false, erro: 'Dia inválido' };
  }
  
  // Verificar ano (deve ser entre 1900 e ano atual)
  const anoAtual = new Date().getFullYear();
  if (ano < 1900 || ano > anoAtual) {
    return { valida: false, erro: 'Ano inválido' };
  }
  
  // Criar data e verificar se é válida
  const data = new Date(ano, mes - 1, dia);
  
  if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
    return { valida: false, erro: 'Data inválida' };
  }
  
  // Verificar se não é data futura
  if (data > new Date()) {
    return { valida: false, erro: 'Data de nascimento não pode ser futura' };
  }
  
  // Verificar idade mínima (não pode ser maior que 150 anos)
  const idade = anoAtual - ano;
  if (idade > 150) {
    return { valida: false, erro: 'Data de nascimento muito antiga' };
  }
  
  return { valida: true };
}

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

    // Validar data de nascimento
    const validacaoData = validarDataNascimento(validatedData.dataNascimento);
    if (!validacaoData.valida) {
      return NextResponse.json(
        { success: false, error: validacaoData.erro },
        { status: 400 }
      );
    }

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
