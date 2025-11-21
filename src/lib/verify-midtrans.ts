// src/lib/verify-midtrans.ts
import crypto from 'crypto';

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  receivedSignature: string
): boolean {
  const data = orderId + statusCode + grossAmount + serverKey;
  const generatedSignature = crypto.createHash('sha512').update(data).digest('hex');
  return generatedSignature === receivedSignature;
}