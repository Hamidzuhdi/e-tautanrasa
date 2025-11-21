// src/lib/midtrans.ts
// Using direct Snap API instead of midtrans-node-client library

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
const baseUrl = isProduction 
  ? 'https://app.midtrans.com/snap/v1' 
  : 'https://app.sandbox.midtrans.com/snap/v1';

export const snap = {
  createTransaction: async (parameter: any) => {
    const authString = Buffer.from(serverKey + ':').toString('base64');
    
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(parameter),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Midtrans API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        authHeader: `Basic ${authString.substring(0, 20)}...`,
      });
      throw new Error(`Midtrans API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  },
};