import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Ambil data user yang sedang login
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.id) },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        alamat: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id.toString(),
        nama: user.nama,
        email: user.email,
        noHp: user.noHp,
        alamat: user.alamat || null,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// PUT: Update profil user
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = BigInt(decoded.id);

    const body = await request.json();
    const { nama, noHp, alamat } = body;

    // Validasi minimal
    if (!nama || !noHp) {
      return NextResponse.json({ message: 'Nama dan No. HP wajib diisi' }, { status: 400 });
    }

    // Cek apakah noHp sudah dipakai orang lain
    const existingHp = await prisma.user.findFirst({
      where: {
        noHp,
        NOT: { id: userId },
      },
    });

    if (existingHp) {
      return NextResponse.json({ message: 'No. HP sudah digunakan akun lain' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nama: nama.trim(),
        noHp: noHp.trim(),
        alamat: alamat?.trim() || null,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        alamat: true,
        role: true,
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id.toString(),
        nama: updatedUser.nama,
        email: updatedUser.email,
        noHp: updatedUser.noHp,
        alamat: updatedUser.alamat,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}