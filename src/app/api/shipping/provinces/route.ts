// src/app/api/shipping/provinces/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://rajaongkir.komerce.id/api/v1/destination/province', {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API response status ${res.status}: ${errorText}`);
      return NextResponse.json({ 
        error: `Gagal mengambil data provinsi: API status ${res.status}`,
        details: errorText
      }, { status: res.status });
    }

    const data = await res.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response structure:', data);
      return NextResponse.json({ 
        error: 'Invalid API response structure' 
      }, { status: 500 });
    }

    console.log('Found provinces:', data.data.length);
    console.log('Sample province:', data.data[0]);

    return NextResponse.json({ results: data.data });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json({ error: 'Gagal mengambil data provinsi internal' }, { status: 500 });
  }
}