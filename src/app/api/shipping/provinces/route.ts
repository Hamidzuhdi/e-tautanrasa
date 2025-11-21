// src/app/api/shipping/provinces/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://collaborator.komerce.id/api/province', {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
      },
    });

    const data = await res.json();
    console.log('RajaOngkir provinces response:', JSON.stringify(data, null, 2)); // Debug log
    
    // Convert to plain object to ensure JSON serialization
    const result = {
      results: data.rajaongkir?.results || [],
      status: data.rajaongkir?.status || {}
    };
    
    console.log('Sending provinces result:', result.results?.length || 0, 'provinces'); // Debug log
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json({ error: 'Gagal mengambil data provinsi' }, { status: 500 });
  }
}
