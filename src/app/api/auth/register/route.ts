// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, email, noHp, password, alamat } = body;

    // Validasi wajib
    if (!nama || !email || !noHp || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Cek email sudah ada?
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Cek no HP sudah ada?
    const existingHp = await prisma.user.findFirst({ where: { noHp } });
    if (existingHp) {
      return NextResponse.json({ message: 'No. HP sudah terdaftar' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user → role otomatis CUSTOMER karena @default(CUSTOMER) di schema
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        password: hashedPassword,
        alamat: alamat || null,
        // role: tidak dikirim → otomatis CUSTOMER
      },
    });

    return NextResponse.json({ message: 'Registrasi berhasil', user: { id: user.id, nama: user.nama, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'Gagal mendaftar, coba lagi nanti' }, { status: 500 });
  }
}