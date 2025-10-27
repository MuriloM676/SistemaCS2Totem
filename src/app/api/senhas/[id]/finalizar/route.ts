import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const senha = await prisma.senha.update({
      where: { id },
      data: {
        status: 'atendido',
      },
      include: {
        paciente: true,
      },
    });

    return NextResponse.json({ success: true, senha });
  } catch (error) {
    console.error('Erro ao finalizar atendimento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao finalizar atendimento' },
      { status: 500 }
    );
  }
}
