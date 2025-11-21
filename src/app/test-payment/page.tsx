'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function TestPayment() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL!;
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.async = true;
    document.body.appendChild(script);

    const handleSnap = () => {
      if (window.snap?.pay) {
        window.snap.pay('CONTOH-TOKEN-NANTI', {
          onSuccess: () => alert('Sukses!'),
          onPending: () => alert('Menunggu pembayaran QRIS...'),
          onError: () => alert('Pembayaran gagal'),
          onClose: () => console.log('Popup ditutup'),
        });
      }
    };

    script.onload = handleSnap;
    // Kalau script sudah pernah diload sebelumnya (HMR), langsung call
    handleSnap();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Test QRIS Midtrans</h1>
        <p className="text-gray-600">Popup QRIS akan muncul otomatis...</p>
      </div>
    </div>
  );
}