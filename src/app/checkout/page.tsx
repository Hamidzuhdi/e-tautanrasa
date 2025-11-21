'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: number;
  product: { 
    id: number; 
    nama: string; 
    harga: number; 
    foto1?: string;
    beratGram: number;
  };
  qty: number;
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

interface ShippingCost {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: { value: number; etd: string; note: string }[];
  }[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);
  const [selectedCost, setSelectedCost] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    alamatKirim: '',
    provinceId: '',
    cityId: '',
    citySearch: '',
    postalCode: '',
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login?returnUrl=/checkout');
          return;
        }

        setIsLoggedIn(true);
      } catch (error) {
        router.push('/login?returnUrl=/checkout');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Load cart from API
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadCart = async () => {
      try {
        const res = await fetch('/api/cart', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCart(data.items || []);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, [isLoggedIn]);

  // Load provinces
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadProvinces = async () => {
      try {
        const res = await fetch('/api/shipping/provinces');
        const data = await res.json();
        console.log('Full API response:', data);
        console.log('Response type:', typeof data);
        console.log('Response keys:', Object.keys(data));
        
        if (data.results && Array.isArray(data.results)) {
          console.log('Found provinces:', data.results.length);
          console.log('First province sample:', data.results[0]);
          setProvinces(data.results);
        } else if (data.error) {
          console.error('API Error:', data.error);
          console.log('Raw data:', data.rawData);
        } else {
          console.log('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    };

    loadProvinces();
  }, [isLoggedIn]);

  // Search cities function
  const searchCities = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setCities([]);
      return;
    }

    try {
      const res = await fetch(`/api/shipping/cities?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.results) {
        setCities(data.results);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  // Auto-fill postal code when city changes - now handled in city selection

  const calculateShipping = async () => {
    if (!form.cityId) {
      alert('Pilih kota tujuan terlebih dahulu');
      return;
    }

    setLoadingShipping(true);
    try {
      const totalWeight = cart.reduce((sum, item) => sum + (item.product.beratGram || 500) * item.qty, 0);

      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: form.cityId,
          weight: totalWeight,
          courier: 'jne:jnt:pos',
        }),
      });

      const data = await res.json();
      console.log('Shipping cost response:', data);
      
      if (data.results) {
        setShippingCosts(data.results);
        
        // Show note if using mock data
        if (data.note) {
          console.warn('Shipping calculation note:', data.note);
        }
      } else {
        alert('Gagal menghitung ongkir');
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      alert('Terjadi kesalahan saat menghitung ongkir');
    } finally {
      setLoadingShipping(false);
    }
  };

  const payWithQRIS = async () => {
    if (!selectedCost) {
      alert('Pilih metode pengiriman terlebih dahulu');
      return;
    }

    if (!form.recipientName || !form.recipientPhone || !form.alamatKirim || !form.provinceId || !form.cityId) {
      alert('Lengkapi data pengiriman terlebih dahulu');
      return;
    }

    setProcessingPayment(true);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart,
          shippingCost: selectedCost.cost[0].value,
          shippingService: `${selectedCost.code.toUpperCase()} ${selectedCost.service}`,
          ...form,
        }),
      });

      const data = await res.json();
      console.log('Order creation response:', data);

      if (data.snapToken) {
        // Check if using mock token (for development without Midtrans credentials)
        if (data.snapToken.startsWith('MOCK-')) {
          alert(`✅ Order berhasil dibuat!\n\nInvoice: ${data.invoice}\n\n⚠️ MOCK PAYMENT MODE\n\nUntuk menampilkan QRIS code:\n1. Daftar di https://dashboard.sandbox.midtrans.com/register\n2. Dapatkan Server Key & Client Key\n3. Update .env.local\n4. Restart server\n\nLihat MIDTRANS_SETUP_GUIDE.md untuk detail`);
          
          // Clear cart and redirect to orders page
          localStorage.removeItem('cart');
          router.push(`/customers/orders?success=true&invoice=${data.invoice}`);
          return;
        }
        
        // Check if Midtrans Snap.js is loaded
        if (typeof (window as any).snap === 'undefined') {
          alert('❌ Midtrans Snap.js belum loaded!\n\nPeriksa:\n1. Internet connection\n2. Client Key di .env.local\n3. Script tag di layout.tsx');
          return;
        }
        
        // Real Midtrans QRIS popup
        console.log('Opening Midtrans Snap with token:', data.snapToken);
        (window as any).snap.pay(data.snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            localStorage.removeItem('cart'); // Clear cart
            router.push(`/customers/orders?success=true&invoice=${data.invoice}`);
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            router.push(`/customers/orders?pending=true&invoice=${data.invoice}`);
          },
          onError: (error: any) => {
            console.error('Payment error:', error);
            alert('Pembayaran gagal, silakan coba lagi');
          },
          onClose: () => {
            console.log('Payment popup closed');
            alert('Pembayaran dibatalkan');
          },
        });
      } else {
        alert(data.error || 'Gagal membuat pesanan');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Terjadi kesalahan saat membuat pesanan');
    } finally {
      setProcessingPayment(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * Number(item.product.harga), 0);
  const shippingFee = selectedCost?.cost?.[0]?.value || 0;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Alamat Pengiriman</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Nama lengkap penerima"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    value={form.recipientPhone}
                    onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi *
                  </label>
                  <select
                    value={form.provinceId}
                    onChange={(e) => {
                      console.log('Province selected:', e.target.value);
                      setForm({ ...form, provinceId: e.target.value, cityId: '', postalCode: '' });
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white text-gray-900"
                    style={{ 
                      color: '#111827 !important', 
                      backgroundColor: '#ffffff !important',
                      fontSize: '16px',
                      lineHeight: '1.5'
                    }}
                  >
                    <option value="" style={{ color: '#6B7280', backgroundColor: '#ffffff' }}>
                      Pilih Provinsi ({provinces.length} tersedia)
                    </option>
                    {provinces.map((prov) => (
                      <option 
                        key={`province-${prov.id}`} 
                        value={prov.id.toString()}
                        style={{ 
                          color: '#111827 !important', 
                          backgroundColor: '#ffffff !important',
                          padding: '8px 12px'
                        }}
                      >
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cari Kota/Kabupaten *
                  </label>
                  <input
                    type="text"
                    value={form.citySearch || ''}
                    onChange={(e) => {
                      setForm({ ...form, citySearch: e.target.value, cityId: '' });
                      if (e.target.value.length >= 3) {
                        searchCities(e.target.value);
                      } else {
                        setCities([]);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Ketik nama kota/kabupaten (min 3 karakter)"
                  />
                  {cities.length > 0 && (
                    <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-lg">
                      {cities.map((city) => (
                        <button
                          key={`city-${city.id}`}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, cityId: city.id.toString(), citySearch: city.label, postalCode: city.zip_code });
                            setCities([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm font-medium text-gray-900">{city.label}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Kode pos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={form.alamatKirim}
                    onChange={(e) => setForm({ ...form, alamatKirim: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    rows={3}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  />
                </div>

                <button
                  onClick={calculateShipping}
                  disabled={!form.cityId || loadingShipping}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                >
                  {loadingShipping ? 'Menghitung...' : 'Hitung Ongkir'}
                </button>
              </div>
            </div>

            {/* Pilih Kurir */}
            {shippingCosts.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Pilih Kurir</h2>
                <div className="space-y-3">
                  {shippingCosts.map((courier) =>
                    courier.costs.map((cost, idx) => (
                      <label
                        key={`${courier.code}-${idx}`}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedCost?.code === courier.code && selectedCost?.service === cost.service
                            ? 'border-rose-600 bg-rose-50'
                            : 'border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          onChange={() => setSelectedCost({ code: courier.code, service: cost.service, cost: cost.cost })}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{courier.name.toUpperCase()} - {cost.service}</div>
                          <div className="text-sm text-gray-600">{cost.description}</div>
                          <div className="text-xs text-gray-500">Estimasi: {cost.cost[0].etd} hari</div>
                        </div>
                        <div className="font-bold text-rose-600">
                          Rp {cost.cost[0].value.toLocaleString('id-ID')}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Ringkasan Produk */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.product.foto1 && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.product.foto1}
                          alt={item.product.nama}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{item.product.nama}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      <p className="text-sm font-semibold text-rose-600">
                        Rp {(item.qty * Number(item.product.harga)).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Ongkir</span>
                  <span>{shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : '-'}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-rose-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-gradient-to-r from-rose-600 to-purple-600 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-2">Metode Pembayaran</h3>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v16H3V4zm2 2v12h14V6H5zm2 2h10v2H7V8zm0 4h7v2H7v-2z"/>
                </svg>
                <span className="font-medium">QRIS (Scan & Pay)</span>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Pembayaran instan menggunakan QRIS. Batas waktu pembayaran 15 menit setelah invoice dibuat.
              </p>
              <button
                onClick={payWithQRIS}
                disabled={!selectedCost || processingPayment}
                className="w-full py-4 bg-white text-rose-600 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {processingPayment ? 'Memproses...' : 'Bayar Sekarang dengan QRIS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}