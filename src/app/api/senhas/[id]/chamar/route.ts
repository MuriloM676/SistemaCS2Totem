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
        status: 'chamando',
        chamadoEm: new Date(),
      },
      include: {
        paciente: true,
      },
    });

    return NextResponse.json({ success: true, senha });
  } catch (error) {
    console.error('Erro ao chamar senha:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao chamar senha' },
      { status: 500 }
    );
  }
}
