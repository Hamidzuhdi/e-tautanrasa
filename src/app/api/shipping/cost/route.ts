// src/app/api/shipping/cost/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination, weight, courier = 'jne:jnt:pos' } = await request.json();

    console.log('Cost calculation request:', { destination, weight, courier });

    const requestBody = {
      origin: process.env.ORIGIN_CITY_ID || '444', // Surabaya
      destination,
      weight: weight || 1000,
      courier,
    };

    console.log('API request body:', requestBody);

    const res = await fetch('https://rajaongkir.komerce.id/api/v1/cost', {
      method: 'POST',
      headers: {
        key: process.env.RAJAONGKIR_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('API response status:', res.status);
    console.log('API response headers:', Object.fromEntries(res.headers));

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API error response:', errorText);
      
      // Since cost API is not working, return mock data for now
      const mockShippingCosts = [
        {
          code: 'jne',
          name: 'Jalur Nugraha Ekakurir (JNE)',
          costs: [
            {
              service: 'REG',
              description: 'Layanan Reguler',
              cost: [{ value: 15000, etd: '2-3', note: '' }]
            },
            {
              service: 'OKE',
              description: 'Ongkos Kirim Ekonomis',
              cost: [{ value: 12000, etd: '3-4', note: '' }]
            }
          ]
        },
        {
          code: 'pos',
          name: 'POS Indonesia',
          costs: [
            {
              service: 'Paket Kilat Khusus',
              description: 'Paket Kilat Khusus',
              cost: [{ value: 18000, etd: '1-2', note: '' }]
            }
          ]
        },
        {
          code: 'jnt',
          name: 'J&T Express',
          costs: [
            {
              service: 'REG',
              description: 'Layanan Reguler',
              cost: [{ value: 14000, etd: '2-3', note: '' }]
            }
          ]
        }
      ];

      return NextResponse.json({ 
        results: mockShippingCosts,
        note: 'Using mock data - Cost API endpoint not available'
      });
    }

    // Try to parse response
    let data;
    try {
      const responseText = await res.text();
      console.log('Raw response text:', responseText);
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Return mock data if parsing fails
      const mockShippingCosts = [
        {
          code: 'jne',
          name: 'Jalur Nugraha Ekakurir (JNE)',
          costs: [
            {
              service: 'REG',
              description: 'Layanan Reguler',
              cost: [{ value: 15000, etd: '2-3', note: '' }]
            }
          ]
        }
      ];
      
      return NextResponse.json({ 
        results: mockShippingCosts,
        note: 'Using mock data - JSON parse error'
      });
    }
    
    console.log('Parsed API response:', data);
    
    return NextResponse.json({
      results: data.data || data.results || [],
    });
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    
    // Return mock data as fallback
    const mockShippingCosts = [
      {
        code: 'jne',
        name: 'Jalur Nugraha Ekakurir (JNE)',
        costs: [
          {
            service: 'REG',
            description: 'Layanan Reguler',
            cost: [{ value: 15000, etd: '2-3', note: '' }]
          },
          {
            service: 'OKE',
            description: 'Ongkos Kirim Ekonomis',
            cost: [{ value: 12000, etd: '3-4', note: '' }]
          }
        ]
      },
      {
        code: 'pos',
        name: 'POS Indonesia',
        costs: [
          {
            service: 'Paket Kilat Khusus',
            description: 'Paket Kilat Khusus',
            cost: [{ value: 18000, etd: '1-2', note: '' }]
          }
        ]
      },
      {
        code: 'jnt',
        name: 'J&T Express',
        costs: [
          {
            service: 'REG',
            description: 'Layanan Reguler',
            cost: [{ value: 14000, etd: '2-3', note: '' }]
          }
        ]
      }
    ];

    return NextResponse.json({ 
      results: mockShippingCosts,
      note: 'Using mock data - API error'
    });
  }
}