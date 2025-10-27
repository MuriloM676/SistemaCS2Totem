import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'aguardando';

    const senhas = await prisma.senha.findMany({
      where: {
        status: status,
      },
      include: {
        paciente: true,
      },
      orderBy: {
        criadoEm: 'asc',
      },
    });

    return NextResponse.json({ success: true, senhas });
  } catch (error) {
    console.error('Erro ao buscar senhas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar senhas' },
      { status: 500 }
    );
  }
}
