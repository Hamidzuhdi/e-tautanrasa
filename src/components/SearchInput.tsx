// components/SearchInput.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  // Real-time search on page (jika ada produk di homepage)
  useEffect(() => {
    if (query.length > 0) {
      // Filter produk di halaman saat ini
      const products = document.querySelectorAll('[data-product-name]');
      products.forEach((product) => {
        const productName = product.getAttribute('data-product-name')?.toLowerCase() || '';
        const productElement = product.closest('.product-card') || product.closest('Link') || product.closest('a');
        
        if (productName.includes(query.toLowerCase())) {
          (productElement as HTMLElement)?.style.setProperty('display', 'block');
        } else {
          (productElement as HTMLElement)?.style.setProperty('display', 'none');
        }
      });
    } else {
      // Show all products when query is empty
      const products = document.querySelectorAll('[data-product-name]');
      products.forEach((product) => {
        const productElement = product.closest('.product-card') || product.closest('Link') || product.closest('a');
        (productElement as HTMLElement)?.style.setProperty('display', 'block');
      });
    }
  }, [query]);

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
        className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 disabled:opacity-50"
      >
        {isSearching ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>
    </form>
  );
}