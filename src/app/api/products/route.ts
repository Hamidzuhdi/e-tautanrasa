// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { kategori: { select: { id: true, nama: true } } },
      orderBy: { id: 'desc' },
    });
    const safeProducts = products.map((p) => ({
      ...p,
      id: p.id.toString(),
    }));
    return NextResponse.json(safeProducts);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const kategoriIdString = formData.get('kategoriId') as string;
    const kategoriId = kategoriIdString && kategoriIdString.trim() !== '' ? parseInt(kategoriIdString) : null;
    const deskripsi = (formData.get('deskripsi') as string) || null;
    const harga = parseFloat(formData.get('harga') as string);
    const stok = parseInt(formData.get('stok') as string) || 0;
    const beratGram = parseInt(formData.get('beratGram') as string) || 0;
    const isActive = formData.get('isActive') === 'true';

    const foto1File = formData.get('foto1') as File | null;
    const foto2File = formData.get('foto2') as File | null;

    if (!nama || !harga) {
      return NextResponse.json({ message: 'Nama dan harga wajib diisi' }, { status: 400 });
    }

    // Generate slug
    const slugBase = nama.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const slug = slugBase + '-' + Date.now();

    // Upload foto1
    let foto1Path: string | null = null;
    if (foto1File) {
      const bytes = await foto1File.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${foto1File.name}`;
      const filepath = path.join(process.cwd(), 'public/img/products', filename);
      await writeFile(filepath, buffer);
      foto1Path = `/img/products/${filename}`;
    }

    // Upload foto2
    let foto2Path: string | null = null;
    if (foto2File) {
      const bytes = await foto2File.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${foto2File.name}`;
      const filepath = path.join(process.cwd(), 'public/img/products', filename);
      await writeFile(filepath, buffer);
      foto2Path = `/img/products/${filename}`;
    }

    const product = await prisma.product.create({
      data: {
        nama,
        slug,
        deskripsi,
        harga,
        stok,
        beratGram,
        kategoriId,
        isActive,
        foto1: foto1Path,
        foto2: foto2Path,
      },
    });

    const safeProduct = {
      ...product,
      id: product.id.toString(),
    };

    return NextResponse.json(safeProduct, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Slug sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal menambah produk' }, { status: 500 });
  }
}