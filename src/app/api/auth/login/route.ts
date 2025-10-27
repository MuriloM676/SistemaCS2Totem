import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { username },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { success: false, error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nome: usuario.nome,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
