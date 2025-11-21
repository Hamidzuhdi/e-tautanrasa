// src/app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { snap } from '@/lib/midtrans';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'superrahasia1234567890';

export async function POST(request: Request) {
  try {
    // === 1. Ambil user dari JWT token (sistem kamu) ===
    const authHeader = request.headers.get('authorization');
    const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: 'Login dulu bro!' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = BigInt(decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nama: true, email: true, noHp: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // === 2. Ambil data dari body ===
    const body = await request.json();
    const {
      items,
      shippingCost,
      shippingService,
      recipientName,
      recipientPhone,
      alamatKirim,
      provinceId,
      cityId,
      postalCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    // === 3. Hitung total ===
    const totalItem = items.reduce((sum: number, i: any) => sum + i.qty, 0);
    const totalHarga = items.reduce((sum: number, i: any) => sum + i.qty * Number(i.product.harga), 0);
    const grandTotal = Math.round(totalHarga + shippingCost); // Round to avoid decimal issues

    // === 4. Generate Invoice + Counter Harian ===
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 20251121
    const todayOrdersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(`${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`),
          lt: new Date(`${today.slice(0, 4)}-${today.slice(4, 6)}-${parseInt(today.slice(6, 8)) + 1}`),
        },
      },
    });

    const counter = todayOrdersCount + 1;
    const invoice = `INV/${today}/${counter.toString().padStart(3, '0')}`;

    // === 5. Buat Order ===
    const order = await prisma.order.create({
      data: {
        invoice,
        invoiceCounter: counter, // ← SEKARANG SUDAH ADA DI SCHEMA!
        userId: user.id,
        totalItem,
        totalHarga: totalHarga,
        ongkir: shippingCost,
        kurir: shippingService.split(' ')[0].toLowerCase(),
        service: shippingService,
        alamatKirim,
        recipientName,
        recipientPhone,
        provinceId: provinceId || null,
        cityId: cityId ? parseInt(cityId) : null,
        postalCode: postalCode || null,
        status: 'PENDING',
        items: {
          create: items.map((i: any) => ({
            productId: BigInt(i.product.id),
            qty: i.qty,
            harga: i.product.harga,
          })),
        },
      },
    });

    // === 6. Buat Snap Token QRIS Only ===
    const parameter = {
      transaction_details: {
        order_id: invoice,
        gross_amount: grandTotal,
      },
      customer_details: {
        first_name: user.nama,
        email: user.email || 'noemail@tautanrasa.com',
        phone: user.noHp,
      },
      item_details: [
        ...items.map((i: any) => ({
          id: i.product.id.toString(),
          price: Number(i.product.harga),
          quantity: i.qty,
          name: i.product.nama.substring(0, 50),
        })),
        {
          id: 'ONGKIR',
          price: shippingCost,
          quantity: 1,
          name: `Ongkir - ${shippingService}`,
        },
      ],
      enabled_payments: ['qris'],
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      invoice,
      snapToken: transaction.token,
      redirect_url: transaction.redirect_url, // kalau mau redirect bukan popup
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}