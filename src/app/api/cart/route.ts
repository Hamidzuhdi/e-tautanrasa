// src/app/api/cart/route.ts
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
  
  // Parse cookies more robustly
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

// GET - Ambil cart user
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = BigInt(user.id);
    
    // Cari atau buat cart untuk user
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nama: true,
                harga: true,
                stok: true,
                foto1: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nama: true,
                  harga: true,
                  stok: true,
                  foto1: true,
                  slug: true,
                }
              }
            }
          }
        }
      });
    }

    // Convert BigInt to string for JSON serialization
    const safeCart = {
      ...cart,
      id: cart.id.toString(),
      userId: cart.userId?.toString(),
      items: cart.items.map(item => ({
        ...item,
        id: item.id.toString(),
        cartId: item.cartId.toString(),
        productId: item.productId.toString(),
        hargaSaatIni: item.hargaSaatIni.toString(),
        product: {
          ...item.product,
          id: item.product.id.toString(),
          harga: item.product.harga.toString(),
        }
      }))
    };

    return NextResponse.json(safeCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ message: 'Gagal mengambil keranjang' }, { status: 500 });
  }
}

// POST - Tambah item ke cart
export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, qty } = await request.json();
    
    if (!productId || !qty || qty < 1) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const userId = BigInt(user.id);
    const productIdBigInt = BigInt(productId);

    // Cek produk dan stok
    const product = await prisma.product.findUnique({
      where: { id: productIdBigInt }
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    }

    if (product.stok < qty) {
      return NextResponse.json({ message: 'Stok tidak mencukupi' }, { status: 400 });
    }

    // Cari atau buat cart
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    // Cek apakah produk sudah ada di cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productIdBigInt
      }
    });

    if (existingItem) {
      // Update quantity
      const newQty = existingItem.qty + qty;
      
      if (product.stok < newQty) {
        return NextResponse.json({ message: 'Stok tidak mencukupi' }, { status: 400 });
      }

      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          qty: newQty,
          hargaSaatIni: product.harga
        }
      });

      return NextResponse.json({
        ...updated,
        id: updated.id.toString(),
        cartId: updated.cartId.toString(),
        productId: updated.productId.toString(),
        hargaSaatIni: updated.hargaSaatIni.toString(),
      });
    } else {
      // Buat item baru
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productIdBigInt,
          qty,
          hargaSaatIni: product.harga
        }
      });

      return NextResponse.json({
        ...newItem,
        id: newItem.id.toString(),
        cartId: newItem.cartId.toString(),
        productId: newItem.productId.toString(),
        hargaSaatIni: newItem.hargaSaatIni.toString(),
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ message: 'Gagal menambah ke keranjang' }, { status: 500 });
  }
}