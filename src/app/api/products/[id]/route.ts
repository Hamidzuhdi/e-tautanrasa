// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
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

  try {
    const existing = await prisma.product.findUnique({ where: { id: BigInt(id) } });
    if (!existing) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });

    let foto1 = existing.foto1;
    let foto2 = existing.foto2;

    // Upload foto1 baru
    if (foto1File) {
      if (existing.foto1) {
        const oldPath = path.join(process.cwd(), 'public', existing.foto1);
        await unlink(oldPath).catch(() => {});
      }
      const bytes = await foto1File.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${foto1File.name}`;
      const filepath = path.join(process.cwd(), 'public/img/products', filename);
      await writeFile(filepath, buffer);
      foto1 = `/img/products/${filename}`;
    }

    // Upload foto2 baru
    if (foto2File) {
      if (existing.foto2) {
        const oldPath = path.join(process.cwd(), 'public', existing.foto2);
        await unlink(oldPath).catch(() => {});
      }
      const bytes = await foto2File.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${foto2File.name}`;
      const filepath = path.join(process.cwd(), 'public/img/products', filename);
      await writeFile(filepath, buffer);
      foto2 = `/img/products/${filename}`;
    }

    const updated = await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        nama,
        deskripsi,
        harga,
        stok,
        beratGram,
        kategoriId,
        isActive,
        foto1,
        foto2,
      },
      include: { kategori: { select: { id: true, nama: true } } },
    });

    const safeUpdated = {
      ...updated,
      id: updated.id.toString(),
    };

    return NextResponse.json(safeUpdated);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  try {
    const product = await prisma.product.findUnique({ where: { id: BigInt(id) } });
    if (!product) return NextResponse.json({ message: 'Tidak ditemukan' }, { status: 404 });

    // Hapus file foto
    if (product.foto1) {
      await unlink(path.join(process.cwd(), 'public', product.foto1)).catch(() => {});
    }
    if (product.foto2) {
      await unlink(path.join(process.cwd(), 'public', product.foto2)).catch(() => {});
    }

    await prisma.product.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ message: 'Produk masih digunakan di pesanan' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal menghapus' }, { status: 500 });
  }
}