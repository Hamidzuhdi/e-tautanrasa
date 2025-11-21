// src/app/api/midtrans/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMidtransSignature } from '@/lib/verify-midtrans';
import { OrderStatus } from '@prisma/client';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
      payment_type,
      transaction_id,
    } = body;

    console.log('Midtrans Webhook received:', {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
    });

    // === 1. VERIFIKASI SIGNATURE ===
    const isValidSignature = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      MIDTRANS_SERVER_KEY,
      signature_key
    );

    if (!isValidSignature) {
      console.error('Invalid signature from Midtrans');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // === 2. CEK APAKAH ORDER ADA ===
    const order = await prisma.order.findUnique({
      where: { invoice: order_id },
      include: { items: true },
    });

    if (!order) {
      console.error('Order not found:', order_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // === 3. CEK DUPLIKAT (IDEMPOTENCY) ===
    // Jika order sudah PAID atau status lebih tinggi, jangan proses lagi
    if (
      order.status === OrderStatus.PAID || 
      order.status === OrderStatus.PACKED || 
      order.status === OrderStatus.SHIPPED || 
      order.status === OrderStatus.DONE
    ) {
      console.log('Order already processed:', order_id);
      return NextResponse.json({ message: 'Already processed' });
    }

    // === 4. UPDATE ORDER STATUS BASED ON TRANSACTION STATUS ===
    let newStatus: OrderStatus = order.status;
    let shouldReduceStock = false;

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        newStatus = OrderStatus.PAID;
        shouldReduceStock = true;
      }
    } else if (transaction_status === 'settlement') {
      newStatus = OrderStatus.PAID;
      shouldReduceStock = true;
    } else if (transaction_status === 'pending') {
      newStatus = OrderStatus.PENDING;
    } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'cancel') {
      newStatus = OrderStatus.CANCELED;
    }

    // === 5. UPDATE ORDER & PAYMENT TABLE ===
    await prisma.$transaction(async (tx) => {
      // Update Order
      await tx.order.update({
        where: { invoice: order_id },
        data: {
          status: newStatus,
          paidAt: newStatus === OrderStatus.PAID ? new Date() : order.paidAt,
        },
      });

      // Upsert Payment record
      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          midtransOrderId: order_id,
          grossAmount: parseFloat(gross_amount),
          paymentType: payment_type,
          transactionId: transaction_id,
          transactionStatus: transaction_status,
          fraudStatus: fraud_status,
          rawJson: body,
        },
        update: {
          transactionStatus: transaction_status,
          fraudStatus: fraud_status,
          rawJson: body,
        },
      });

      // === 6. KURANGI STOK HANYA SAAT STATUS = PAID ===
      if (shouldReduceStock) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stok: {
                decrement: item.qty,
              },
            },
          });
        }
        console.log('Stock reduced for order:', order_id);
      }
    });

    console.log('Order updated successfully:', order_id, 'New status:', newStatus);

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      order_id,
      new_status: newStatus,
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
