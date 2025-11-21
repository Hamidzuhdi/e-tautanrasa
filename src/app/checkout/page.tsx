'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface CartItem {
  product: { id: string; nama: string; harga: number; foto1?: string };
  qty: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [costs, setCosts] = useState<any[]>([]);
  const [selectedCost, setSelectedCost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    alamatKirim: '',
    provinceId: '',
    cityId: '',
    postalCode: '',
  });

  // Load cart from localStorage (atau dari API kalau sudah punya)
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.qty * Number(i.product.harga), 0);
  const total = subtotal + (selectedCost?.cost?.[0]?.value || 0);

  const calculateShipping = async () => {
    if (!form.cityId) return toast.error('Pilih kota tujuan');

    const weight = cart.reduce((sum, i) => sum + i.qty * 500, 0); // contoh 500g per item
    const res = await fetch('/api/shipping/cost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: form.cityId, weight }),
    });

    const data = await res.json();
    if (data.results) {
      setCosts(data.results);
    }
  };

  const payWithQRIS = async () => {
    if (!selectedCost) return toast.error('Pilih kurir dulu');

    setLoading(true);
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        shippingCost: selectedCost.cost[0].value,
        shippingService: `${selectedCost.code.toUpperCase()} ${selectedCost.service}`,
        ...form,
      }),
    });

    const data = await res.json();
    if (data.snapToken) {
      // Popup QRIS
      (window as any).snap.pay(data.snapToken, {
        onSuccess: () => router.push('/payment/success'),
        onPending: () => router.push('/payment/pending'),
        onError: () => toast.error('Pembayaran gagal'),
        onClose: () => toast('Pembayaran dibatalkan'),
      });
    } else {
      toast.error(data.error || 'Gagal membuat pesanan');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* Form Alamat */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Alamat Pengiriman</h2>
          {/* form input alamat, province, city, dll */}
          {/* ... (bisa copy dari profil atau manual) */}
        </div>

        {/* Ringkasan & Ongkir */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Ringkasan Pesanan</h2>
          {/* list produk */}
          <div className="border-t pt-4">
            <div className="flex justify-between"><span>Ongkir</span><span>Rp {selectedCost?.cost?.[0]?.value?.toLocaleString() || 0}</span></div>
            <div className="text-xl font-bold mt-4 flex justify-between">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={payWithQRIS}
            disabled={loading || !selectedCost}
            className="w-full mt-6 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold rounded-lg hover:from-rose-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Bayar dengan QRIS'}
          </button>
        </div>
      </div>
    </div>
  );
}