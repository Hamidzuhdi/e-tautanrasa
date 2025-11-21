'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartProduct {
  id: string;
  nama: string;
  harga: string;
  stok: number;
  foto1: string | null;
  slug: string;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  qty: number;
  hargaSaatIni: string;
  product: CartProduct;
}

interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
}

export default function CustomerOrdersPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      console.log('Fetching cart with cookies...');
      const response = await fetch('/api/cart', {
        credentials: 'include'
      });

      console.log('Cart response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else if (response.status === 401) {
        console.log('Unauthorized - redirecting to login');
        // User not logged in, redirect to login
        window.location.href = '/login';
      } else {
        console.error('Cart fetch failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    setUpdating(itemId);
    try {
      console.log(`Updating cart item ${itemId} to quantity ${newQty}`);
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qty: newQty })
      });

      console.log(`Update response status: ${response.status}`);

      if (response.ok) {
        console.log('Update successful, refreshing cart...');
        // Refresh cart
        await fetchCart();
      } else {
        const error = await response.json();
        console.error('Update failed:', error);
        alert(error.message || 'Gagal mengupdate quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Terjadi kesalahan saat mengupdate quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Yakin ingin menghapus item ini dari keranjang?')) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Refresh cart
        await fetchCart();
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menghapus item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Terjadi kesalahan saat menghapus item');
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      return total + (Number(item.hargaSaatIni) * item.qty);
    }, 0);
  };

  const calculateItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.qty, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-rose-600">
              Tautan Rasa
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-rose-600">Beranda</Link>
            </nav>
          </div>
        </header>

        {/* Loading Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-rose-600">
            Tautan Rasa
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-rose-600">Beranda</Link>
            <Link href="/#best-seller" className="text-gray-700 hover:text-rose-600">Best Seller</Link>
            <Link href="/#news" className="text-gray-700 hover:text-rose-600">News</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-rose-600">Beranda</Link>
          <span>/</span>
          <span className="text-rose-600 font-medium">Keranjang Saya</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Keranjang Saya
          </h1>
          {cart && cart.items.length > 0 && (
            <span className="text-gray-600">
              {calculateItemCount()} item dalam keranjang
            </span>
          )}
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-gray-600 mb-8">
              Belum ada produk dalam keranjang Anda. Yuk mulai berbelanja!
            </p>
            <Link 
              href="/" 
              className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Mulai Berbelanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.foto1 ? (
                        <Image
                          src={item.product.foto1}
                          alt={item.product.nama}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-3xl">📷</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product.nama}
                      </h3>
                      <p className="text-rose-600 font-medium mb-2">
                        Rp {Number(item.hargaSaatIni).toLocaleString('id-ID')} per item
                      </p>
                      <p className="text-sm text-gray-500">
                        Stok tersedia: {item.product.stok}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:items-end space-y-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          disabled={item.qty <= 1 || updating === item.id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updating === item.id ? '...' : item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          disabled={item.qty >= item.product.stok || updating === item.id}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          Rp {(Number(item.hargaSaatIni) * item.qty).toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Item:</span>
                  <span>{calculateItemCount()} item</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                  <span>Total Harga:</span>
                  <span className="text-rose-600">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Link
                    href="/"
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Lanjut Belanja
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex-1 py-3 px-6 bg-rose-600 text-white text-center rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}