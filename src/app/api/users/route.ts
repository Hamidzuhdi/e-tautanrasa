import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, noHp } = await request.json();

    if (!name || !email || !password || !noHp) {
      return NextResponse.json(
        { error: 'Nama, email, noHp, dan password harus diisi' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nama: name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        noHp,
      },
    });

    return NextResponse.json(
      {
        message: 'User berhasil dibuat',
        user: {
          id: user.id.toString(),
          nama: user.nama,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        alamat: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const safeUsers = users.map((u) => ({
      ...u,
      id: u.id.toString(),
    }));

    return NextResponse.json(
      {
        message: 'Data user berhasil diambil',
        users: safeUsers,
        total: safeUsers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
