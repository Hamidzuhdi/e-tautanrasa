// src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: number;
  product_name: string;
  product_image: string;
  harga: number;
  qty: number;
  subtotal: number;
}

interface ShippingAddress {
  recipient_name: string;
  recipient_phone: string;
  alamat_kirim: string;
  province_id: string;
  city_id: string;
  postal_code: string;
}

export default function CheckoutPage() {
  // Simulasi data dari cart
  const [cartItems] = useState<CartItem[]>([
    {
      id: 1,
      product_name: 'Bloom Stripe Mauve',
      product_image: '/img/Tautan Rasa - Bloom Stripe (Mauve).png',
      harga: 140000,
      qty: 2,
      subtotal: 280000
    },
    {
      id: 2,
      product_name: 'Cherry Blossom Charm',
      product_image: '/img/Tautan Rasa - Cherry Blossom.png',
      harga: 165000,
      qty: 1,
      subtotal: 165000
    }
  ]);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipient_name: '',
    recipient_phone: '',
    alamat_kirim: '',
    province_id: '',
    city_id: '',
    postal_code: ''
  });

  const [selectedShipping, setSelectedShipping] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Simulasi data pengiriman
  const shippingOptions = [
    { id: 'jne-reg', courier: 'JNE', service: 'REG', cost: 15000, etd: '2-3 hari' },
    { id: 'jne-oke', courier: 'JNE', service: 'OKE', cost: 12000, etd: '3-5 hari' },
    { id: 'pos-reguler', courier: 'POS', service: 'Reguler', cost: 10000, etd: '4-6 hari' },
  ];

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Transfer Bank', icon: '🏦' },
    { id: 'gopay', name: 'GoPay', icon: '💚' },
    { id: 'ovo', name: 'OVO', icon: '💜' },
    { id: 'dana', name: 'DANA', icon: '💙' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', icon: '💵' },
  ];

  const totalHarga = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const selectedShippingCost = shippingOptions.find(opt => opt.id === selectedShipping)?.cost || 0;
  const grandTotal = totalHarga + selectedShippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!shippingAddress.recipient_name || !shippingAddress.recipient_phone || 
        !shippingAddress.alamat_kirim || !selectedShipping || !paymentMethod) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    // Simulasi proses checkout
    const orderData = {
      items: cartItems,
      shipping: shippingAddress,
      shipping_method: selectedShipping,
      payment_method: paymentMethod,
      total: grandTotal
    };

    console.log('Order data:', orderData);
    
    // Redirect ke halaman payment atau success
    alert('Pesanan berhasil dibuat! Redirecting ke halaman pembayaran...');
    // router.push('/payment/order-id');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/cart" className="text-gray-500 hover:text-gray-700">Keranjang</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Lengkapi data pemesanan Anda</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Penerima *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.recipient_name}
                        onChange={(e) => setShippingAddress({...shippingAddress, recipient_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Nama lengkap penerima"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.recipient_phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, recipient_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress.alamat_kirim}
                      onChange={(e) => setShippingAddress({...shippingAddress, alamat_kirim: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provinsi *
                      </label>
                      <select
                        required
                        value={shippingAddress.province_id}
                        onChange={(e) => setShippingAddress({...shippingAddress, province_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Pilih Provinsi</option>
                        <option value="11">Jawa Timur</option>
                        <option value="12">Jawa Tengah</option>
                        <option value="31">DKI Jakarta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kota/Kabupaten *
                      </label>
                      <select
                        required
                        value={shippingAddress.city_id}
                        onChange={(e) => setShippingAddress({...shippingAddress, city_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Pilih Kota</option>
                        <option value="444">Surabaya</option>
                        <option value="445">Malang</option>
                        <option value="152">Jakarta Selatan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({...shippingAddress, postal_code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Metode Pengiriman</h2>
                </div>
                <div className="p-6 space-y-3">
                  {shippingOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-rose-500 cursor-pointer">
                      <label className="flex items-center cursor-pointer w-full">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">
                                {option.courier} - {option.service}
                              </p>
                              <p className="text-sm text-gray-600">Estimasi: {option.etd}</p>
                            </div>
                            <p className="font-bold text-gray-900">
                              Rp{option.cost.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h2>
                </div>
                <div className="p-6 space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center p-4 border rounded-lg hover:border-rose-500 cursor-pointer">
                      <label className="flex items-center cursor-pointer w-full">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                        />
                        <div className="ml-3 flex items-center">
                          <span className="text-2xl mr-3">{method.icon}</span>
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product_name}</p>
                          <p className="text-xs text-gray-500">{item.qty}x Rp{item.harga.toLocaleString('id-ID')}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Rp{item.subtotal.toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Calculations */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ongkos Kirim</span>
                      <span>
                        {selectedShippingCost > 0 
                          ? `Rp${selectedShippingCost.toLocaleString('id-ID')}` 
                          : 'Pilih pengiriman'
                        }
                      </span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-rose-600">Rp{grandTotal.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedShipping || !paymentMethod}
                  >
                    Buat Pesanan
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Dengan membuat pesanan, Anda menyetujui syarat dan ketentuan kami
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}