import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// Function untuk convert BigInt di object
function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

// GET: Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Data user berhasil diambil',
        user: serializeBigInt(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const body = await request.json();
    console.log("BODY RECEIVED:", body); // <--- DEBUG

    const { name, email, password, nohp } = body;

    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Cek email unik
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }
    }

    const updateData: any = {};

    if (name) updateData.nama = name;
    if (email) updateData.email = email;
    if (nohp) updateData.noHp = nohp;

    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
    }

    console.log("UPDATEDATA:", updateData); // <--- DEBUG

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(id) },
      data: updateData,
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
    });

    return NextResponse.json({
      message: "User berhasil diupdate",
      user: serializeBigInt(updatedUser),
    });

  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}


// DELETE: Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json(
      { message: 'User berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
