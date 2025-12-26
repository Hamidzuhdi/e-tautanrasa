import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json();
    const { nama, slug, icon } = body;

    if (!nama) {
      return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 });
    }

    // Cek slug unik kecuali untuk dirinya sendiri
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: { nama, slug: slug || null, icon: icon || null },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: 'Kategori masih digunakan di produk, tidak bisa dihapus' },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Gagal menghapus' }, { status: 500 });
  }
}