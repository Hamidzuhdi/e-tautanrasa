// components/SearchInput.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  harga: number;
  stok: number;
  foto1: string | null;
  foto2: string | null;
  isActive: boolean;
  kategori_id: number;
  kategori?: {
    nama: string;
  };
}

export default function SearchInput({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setTimeout(() => setIsSearching(false), 1000);
      setShowResults(false);
    }
  };

  // Real-time search based on products table
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length > 2) { // Start searching after 3 characters
        setIsLoading(true);
        try {
          const response = await fetch('/api/products');
          if (response.ok) {
            const products: Product[] = await response.json();
            
            // Filter products by nama field (case-insensitive)
            const filtered = products.filter((product) =>
              product.nama.toLowerCase().includes(query.toLowerCase()) && 
              product.isActive && 
              product.stok > 0
            );
            
            setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
            setShowResults(true);
          }
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk..."
          className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 disabled:opacity-50"
        >
          {isSearching || isLoading ? (
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

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    router.push(`/products/${product.slug}`);
                    setShowResults(false);
                    setQuery('');
                  }}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {product.foto1 && (
                    <img
                      src={product.foto1}
                      alt={product.nama}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.nama}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Rp {product.harga.toLocaleString('id-ID')}
                    </p>
                    {product.kategori && (
                      <p className="text-xs text-gray-400">
                        {product.kategori.nama}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-2 text-center border-t border-gray-100">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Lihat semua hasil ({searchResults.length}+)
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {isLoading ? 'Mencari...' : 'Tidak ada produk ditemukan'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}