import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, slug, icon } = body;

    if (!nama) {
      return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 });
    }

    const existingSlug = slug
      ? await prisma.category.findUnique({ where: { slug } })
      : null;

    if (existingSlug) {
      return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        nama,
        slug: slug || null,
        icon: icon || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Slug sudah ada' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal membuat kategori' }, { status: 500 });
  }
}