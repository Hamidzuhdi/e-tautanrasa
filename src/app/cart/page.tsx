// src/app/cart/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  harga: number;
  qty: number;
  subtotal: number;
  kategori: string;
}

export default function CartPage() {
  // Cart items will be loaded from database/state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty <= 0) return;
    
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, qty: newQty, subtotal: item.harga * newQty }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalHarga = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const ongkir = 0; // Akan dihitung nanti berdasarkan alamat
  const grandTotal = totalHarga + ongkir;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Keranjang Belanja Kosong</h2>
            <p className="mt-2 text-gray-600">Tambahkan produk favorit Anda ke keranjang</p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Mulai Belanja
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Keranjang Belanja</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          <p className="text-gray-600">{totalItems} item dalam keranjang</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Item yang Dipilih ({totalItems})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.product_name}</h3>
                            <p className="text-sm text-gray-500">{item.kategori}</p>
                            <p className="text-lg font-bold text-rose-600 mt-1">
                              Rp{item.harga.toLocaleString('id-ID')}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Hapus item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.qty <= 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                              {item.qty}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                              Rp{item.subtotal.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Keranjang Kosong</h3>
                    <p className="text-gray-600 mb-6">
                      Belum ada produk dalam keranjang belanja Anda.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mulai Belanja
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center text-rose-600 hover:text-rose-800 font-medium"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Lanjutkan Belanja
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} item)</span>
                  <span className="font-medium">Rp{totalHarga.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium">
                    {ongkir === 0 ? 'Dihitung saat checkout' : `Rp${(ongkir as number).toLocaleString('id-ID')}`}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">Rp{grandTotal.toLocaleString('id-ID')}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Kode Promo (Opsional)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Masukkan kode promo"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full block text-center px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Lanjut ke Pembayaran
                </Link>

                <p className="text-xs text-gray-500 text-center">
                  Aman dan terpercaya dengan SSL encryption
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Informasi Pengiriman</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    • Gratis ongkir untuk pembelian di atas Rp500.000<br />
                    • Estimasi pengiriman 2-5 hari kerja<br />
                    • Tersedia COD untuk area tertentu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}