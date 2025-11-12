// components/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol 3 Garis */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay & Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 p-6 md:hidden transform transition-transform duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <nav className="mt-12 space-y-6">
              <Link href="/" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Produk
              </Link>
              <Link href="/categories" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Kategori
              </Link>
              <Link href="/cart" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Keranjang
              </Link>
              <Link href="/#about-tautan-rasa" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Tentang Kami
              </Link>
              <Link href="/#news" className="block text-lg font-medium text-gray-900 hover:text-red-600" onClick={() => setIsOpen(false)}>
                Berita
              </Link>
              
              <hr className="my-4 border-gray-200" />
              
              {/* Mobile Auth Section */}
              <div className="pt-4">
                <AuthButton />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}