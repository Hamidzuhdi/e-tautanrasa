'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  notes?: string;
  orderItems: Array<{
    id: number;
    quantity: number;
    priceAtTime: number;
    product: {
      id: number;
      name: string;
      images: string[];
    };
  }>;
}

interface OrderFilters {
  status: string;
  search: string;
}

export default function CustomerOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'ALL',
    search: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.orders) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    // Filter by status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.orderItems.some(item => 
          item.product.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu Konfirmasi';
      case 'PROCESSING': return 'Sedang Diproses';
      case 'SHIPPED': return 'Dalam Pengiriman';
      case 'DELIVERED': return 'Telah Diterima';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const canCancelOrder = (order: Order) => {
    return order.status === 'PENDING' || order.status === 'PROCESSING';
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (response.ok) {
        fetchOrders();
        alert('Pesanan berhasil dibatalkan');
        if (selectedOrder?.id === orderId) {
          closeModal();
        }
      } else {
        alert('Gagal membatalkan pesanan');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Terjadi kesalahan saat membatalkan pesanan');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please login to access orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-gray-600">Kelola dan pantau status pesanan Anda</p>
        </div>
        <Link href="/products" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Belanja Lagi
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Menunggu Konfirmasi</option>
              <option value="PROCESSING">Sedang Diproses</option>
              <option value="SHIPPED">Dalam Pengiriman</option>
              <option value="DELIVERED">Telah Diterima</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Pesanan
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nomor order atau produk..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Pesanan</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Jumlah Item</p>
                    <p className="text-lg font-bold text-gray-900">
                      {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} item
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <span key={item.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {item.product.name} ({item.quantity}x)
                    </span>
                  ))}
                  {order.orderItems.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      +{order.orderItems.length - 3} lainnya
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <button
                    onClick={() => showOrderDetail(order)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Lihat Detail
                  </button>
                  
                  <div className="flex gap-2">
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Batalkan Pesanan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 mb-4">Anda belum memiliki pesanan apapun</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Detail Order #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedOrder.status)} mt-1`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tanggal Order</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Pembayaran</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Alamat Pengiriman</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Item Pesanan</h3>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rp {item.priceAtTime.toLocaleString('id-ID')} / item
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          Rp {(item.priceAtTime * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Catatan</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {canCancelOrder(selectedOrder) && (
                  <button
                    onClick={() => cancelOrder(selectedOrder.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Batalkan Pesanan
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}