// src/lib/midtrans.ts
import { MidtransClient } from 'midtrans-node-client';

// Menggunakan MidtransClient.Snap untuk versi terbaru
const snap = new MidtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true' || false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export { snap };