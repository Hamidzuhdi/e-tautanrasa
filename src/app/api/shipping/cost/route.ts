// src/app/api/shipping/cost/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination, weight, courier = 'jne:jnt:pos' } = await request.json();

    const res = await fetch('https://collaborator.komerce.id/api/cost', {
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
    
    // Convert to plain object to ensure JSON serialization
    const result = {
      results: data.rajaongkir?.results || [],
      status: data.rajaongkir?.status || {}
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    return NextResponse.json({ error: 'Gagal menghitung ongkir' }, { status: 500 });
  }
}