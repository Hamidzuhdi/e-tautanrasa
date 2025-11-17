'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentUsers: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
          setStats({
            totalUsers: data.total,
            recentUsers: data.users.filter(
              (user: User) =>
                new Date(user.createdAt).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000
            ).length,
          });
        }
      } catch (error) {
        console.error('Fetch users error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Kelola sistem admin TAUTAN RASA dari sini
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-l-4 border-rose-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
                <p className="text-4xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-rose-100 p-4 rounded-full">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 01-6-6v.003h-.001a6.99 6.99 0 0110.126 6.33.78.78 0 01-.154.54A6.97 6.97 0 0110 18a6.99 6.99 0 01-1 .125V16.5a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v2.128a7 7 0 01-6-6.993V12a1 1 0 10-2 0 9 9 0 0018 0 1 1 0 10-2 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Total pengguna admin terdaftar</p>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  New Users (7 Days)
                </p>
                <p className="text-4xl font-bold text-gray-900">{stats.recentUsers}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Pengguna baru dalam 7 hari terakhir</p>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-600">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20h12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2h6z" />
              </svg>
              <p>Belum ada user terdaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-rose-200"
            >
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and manage all users</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-200"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New User</h3>
                  <p className="text-sm text-gray-600">Create a new admin user</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
