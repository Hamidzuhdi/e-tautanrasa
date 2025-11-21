// src/app/api/shipping/cost/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { destination, weight, courier = 'jne:jnt:pos' } = await request.json();

  const res = await fetch('https://api.rajaongkir.com/starter/cost', {
    method: 'POST',
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin: process.env.ORIGIN_CITY_ID, // 444 = Surabaya
      destination,
      weight: weight || 1000, // gram, default 1kg
      courier,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data.rajaongkir);
}