// src/app/api/shipping/cities/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search');

  if (!search) {
    return NextResponse.json({ error: 'Search parameter required' }, { status: 400 });
  }

  try {
    const url = `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=50`;

    const res = await fetch(url, {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    });

    if (!res.ok) {
      console.error(`Cities API error: ${res.status}`);
      return NextResponse.json({ error: 'Gagal mencari kota' }, { status: res.status });
    }

    const data = await res.json();
    console.log('Cities search result:', data.data?.length || 0, 'found');
    
    return NextResponse.json({
      results: data.data || [],
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    return NextResponse.json({ error: 'Gagal mencari kota' }, { status: 500 });
  }
}
