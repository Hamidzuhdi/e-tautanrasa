// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = BigInt(decoded.id);

    // Get query params
    const { searchParams } = new URL(request.url);
    const includeItems = searchParams.get('includeItems') === 'true';
    const status = searchParams.get('status');

    // Build query
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: includeItems ? {
          include: {
            product: {
              select: {
                nama: true,
                foto1: true,
              }
            }
          }
        } : false,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      id: order.id.toString(),
      userId: order.userId?.toString(),
      totalHarga: order.totalHarga.toString(),
      ongkir: order.ongkir.toString(),
      items: order.items?.map(item => ({
        ...item,
        id: item.id.toString(),
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
        harga: item.harga.toString(),
      })),
      payment: order.payment ? {
        ...order.payment,
        id: order.payment.id.toString(),
        orderId: order.payment.orderId.toString(),
        grossAmount: order.payment.grossAmount?.toString(),
      } : null,
    }));

    return NextResponse.json(serializedOrders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
