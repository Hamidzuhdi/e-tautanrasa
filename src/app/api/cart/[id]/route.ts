// src/app/api/cart/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

async function getUserFromToken(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  
  if (!cookieHeader) {
    return null;
  }
  
  // Parse cookies more robustly - same method as cart/route.ts
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies['token'];
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// PUT - Update quantity item di cart
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { qty } = await request.json();
    const { id } = await params;
    const itemId = BigInt(id);
    
    if (!qty || qty < 1) {
      return NextResponse.json({ message: 'Quantity tidak valid' }, { status: 400 });
    }

    // Cek apakah item ini milik user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: BigInt(user.id)
        }
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return NextResponse.json({ message: 'Item tidak ditemukan' }, { status: 404 });
    }

    // Cek stok
    if (cartItem.product.stok < qty) {
      return NextResponse.json({ message: 'Stok tidak mencukupi' }, { status: 400 });
    }

    // Update quantity dan harga saat ini
    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        qty,
        hargaSaatIni: cartItem.product.harga
      }
    });

    return NextResponse.json({
      ...updated,
      id: updated.id.toString(),
      cartId: updated.cartId.toString(),
      productId: updated.productId.toString(),
      hargaSaatIni: updated.hargaSaatIni.toString(),
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ message: 'Gagal mengupdate item' }, { status: 500 });
  }
}

// DELETE - Hapus item dari cart
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const itemId = BigInt(id);

    // Cek apakah item ini milik user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: BigInt(user.id)
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ message: 'Item tidak ditemukan' }, { status: 404 });
    }

    // Hapus item
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: 'Item berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ message: 'Gagal menghapus item' }, { status: 500 });
  }
}