'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchDashboardStats();
    }
  }, [session, status]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch user's orders for dashboard stats
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.orders) {
        const orders = data.orders;
        
        const dashboardStats: DashboardStats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'PENDING').length,
          completedOrders: orders.filter((o: any) => o.status === 'DELIVERED').length,
          totalSpent: orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0),
          recentOrders: orders.slice(0, 5) // Get 5 most recent orders
        };
        
        setStats(dashboardStats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <p className="text-gray-500">Please login to access dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Selamat Datang, {session.user.name}! 👋
        </h1>
        <p className="text-blue-100">
          Kelola pesanan dan profil Anda dengan mudah
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pesanan Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pesanan Selesai</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.completedOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pembelian</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {(stats?.totalSpent || 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/customer/orders" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Lihat Pesanan</h3>
                <p className="text-sm text-gray-500">Monitor status pesanan Anda</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/customer/profile" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Edit Profil</h3>
                <p className="text-sm text-gray-500">Update informasi akun</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/products" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Belanja Sekarang</h3>
                <p className="text-sm text-gray-500">Jelajahi produk kami</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Pesanan Terbaru</h2>
            <Link href="/customer/orders" className="text-sm text-blue-600 hover:text-blue-800">
              Lihat Semua
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">Belum ada pesanan</p>
              <Link href="/products" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
                Mulai Belanja
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}