'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:grid lg:grid-cols-[16rem_1fr]">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-20 flex items-center justify-between p-4">
        <div className="text-xl md:text-2xl font-bold text-gray-900">
          TAUTAN RASA ADMIN
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:transform-none`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">TAUTAN RASA</div>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin') && !isActive('/admin/users')
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/users')
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 01-6-6v.003h-.001a6.99 6.99 0 0110.126 6.33.78.78 0 01-.154.54A6.97 6.97 0 0110 18a6.99 6.99 0 01-1 .125V16.5a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v2.128a7 7 0 01-6-6.993V12a1 1 0 10-2 0 9 9 0 0018 0 1 1 0 10-2 0z" />
            </svg>
            <span className="font-medium">User Management</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className={`transition-all duration-300 pt-16 lg:pt-0`}>
        {children}
      </main>
    </div>
  );
}
