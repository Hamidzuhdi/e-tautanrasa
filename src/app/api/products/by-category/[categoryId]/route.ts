// src/app/api/products/by-category/[categoryId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const categoryId = parseInt(params.categoryId);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        kategoriId: categoryId,
        isActive: true,
      },
      include: { 
        kategori: { 
          select: { id: true, nama: true, slug: true, icon: true } 
        } 
      },
      orderBy: { id: 'desc' },
    });

    const safeProducts = products.map((p) => ({
      ...p,
      id: p.id.toString(),
    }));

    return NextResponse.json(safeProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json({ message: 'Gagal mengambil data produk' }, { status: 500 });
  }
}