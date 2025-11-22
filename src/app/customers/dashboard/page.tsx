'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  qty: number;
  harga: string;
  product: {
    nama: string;
    foto1: string | null;
  };
}

interface Order {
  id: string;
  invoice: string;
  status: string;
  totalHarga: string;
  ongkir: string;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
  recipientName: string;
  alamatKirim: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login?returnUrl=/customers/dashboard');
          return;
        }
        loadOrders();
      } catch (error) {
        router.push('/login?returnUrl=/customers/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders?includeItems=true', { 
        credentials: 'include' 
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Active orders: PAID, PACKED, SHIPPED
        const active = data.filter((order: Order) => 
          ['PAID', 'PACKED', 'SHIPPED'].includes(order.status)
        );
        
        // History: DONE orders
        const history = data.filter((order: Order) => 
          order.status === 'DONE'
        );
        
        setActiveOrders(active);
        setHistoryOrders(history);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PAID: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dibayar' },
      PACKED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Dikemas' },
      SHIPPED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Dikirim' },
      DONE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      PENDING: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Menunggu' },
      CANCELED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };

    const badge = badges[status] || badges.PENDING;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusProgress = (status: string) => {
    const steps = ['PAID', 'PACKED', 'SHIPPED', 'DONE'];
    const currentIndex = steps.indexOf(status);
    const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
    
    return (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Dibayar</span>
          <span>Dikemas</span>
          <span>Dikirim</span>
          <span>Selesai</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: string | number) => {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
  };

  const renderOrderCard = (order: Order, showProgress: boolean = true) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);
    const grandTotal = Number(order.totalHarga) + Number(order.ongkir);

    return (
      <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{order.invoice}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Progress Bar */}
        {showProgress && getStatusProgress(order.status)}

        {/* Order Items */}
        <div className="mt-4 space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.product.foto1 && (
                <img 
                  src={item.product.foto1} 
                  alt={item.product.nama}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.product.nama}</p>
                <p className="text-xs text-gray-500">{item.qty}x {formatCurrency(item.harga)}</p>
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-gray-500">+{order.items.length - 2} produk lainnya</p>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Total Produk ({totalItems} item)</span>
            <span className="font-medium">{formatCurrency(order.totalHarga)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Ongkir</span>
            <span className="font-medium">{formatCurrency(order.ongkir)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-rose-600">
            <span>Total Pembayaran</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Penerima: {order.recipientName}</p>
          <p className="text-xs text-gray-500 truncate">{order.alamatKirim}</p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link 
            href={`/customers/orders?invoice=${order.invoice}`}
            className="flex-1 py-2 text-center border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition text-sm font-medium"
          >
            Lihat Detail
          </Link>
          {order.status === 'SHIPPED' && (
            <button className="flex-1 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition text-sm font-medium">
              Lacak Paket
            </button>
          )}
        </div>
      </div>
    );
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Saya</h1>
          <p className="text-gray-600">Kelola pesanan dan lihat riwayat transaksi Anda</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 px-6 font-medium text-sm transition ${
                activeTab === 'active'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Pesanan Aktif ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-medium text-sm transition ${
                activeTab === 'history'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Riwayat Pesanan ({historyOrders.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'active' ? (
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesanan Aktif</h3>
                <p className="text-gray-600 mb-6">Pesanan yang sudah dibayar akan muncul di sini</p>
                <Link 
                  href="/"
                  className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              activeOrders.map(order => renderOrderCard(order, true))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {historyOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Riwayat Pesanan</h3>
                <p className="text-gray-600">Riwayat pesanan yang selesai akan muncul di sini</p>
              </div>
            ) : (
              historyOrders.map(order => renderOrderCard(order, false))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
