// src/app/api/shipping/cities/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const provinceId = request.nextUrl.searchParams.get('province');

  try {
    const url = provinceId
      ? `https://collaborator.komerce.id/api/city?province=${provinceId}`
      : 'https://collaborator.komerce.id/api/city';

    const res = await fetch(url, {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    });

    const data = await res.json();
    
    // Convert to plain object to ensure JSON serialization
    const result = {
      results: data.rajaongkir?.results || [],
      status: data.rajaongkir?.status || {}
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Gagal mengambil data kota' }, { status: 500 });
  }
}
