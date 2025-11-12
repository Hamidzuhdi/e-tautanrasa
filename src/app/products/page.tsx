// src/app/products/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  nama: string;
  slug: string;
  kategori: string;
  harga: number;
  foto1: string;
  is_active: boolean;
}

export default function ProductsPage() {
  // Simulasi data produk - nantinya dari API
  const [products] = useState<Product[]>([
    {
      id: 1,
      nama: 'Bloom Stripe Mauve',
      slug: 'bloom-stripe-mauve',
      kategori: 'Drawstring Collection',
      harga: 140000,
      foto1: '/img/Tautan Rasa - Bloom Stripe (Mauve).png',
      is_active: true
    },
    {
      id: 2,
      nama: 'Cherry Blossom Charm',
      slug: 'cherry-blossom-charm',
      kategori: 'Charm Series',
      harga: 165000,
      foto1: '/img/Tautan Rasa - Cherry Blossom.png',
      is_active: true
    },
    {
      id: 3,
      nama: 'Ocean Bloom',
      slug: 'ocean-bloom',
      kategori: 'Charm Series',
      harga: 190000,
      foto1: '/img/Tautan Rasa - Ocean Bloom.png',
      is_active: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = ['Charm Series', 'Taut Series', 'Drawstring Collection'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.kategori === selectedCategory;
    return matchesSearch && matchesCategory && product.is_active;
  });

  const addToCart = (productId: number) => {
    // Simulasi add to cart - nantinya akan menggunakan state management
    console.log('Add to cart:', productId);
    alert('Produk ditambahkan ke keranjang!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Produk</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Semua Produk</h1>
          <p className="text-gray-600">Koleksi lengkap TAUTAN RASA</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="">Urutkan</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="name">Nama A-Z</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.foto1}
                  alt={product.nama}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Link
                    href={`/products/${product.slug}`}
                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs bg-rose-100 text-rose-800 rounded-full font-medium">
                    {product.kategori}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.nama}
                </h3>
                
                <p className="text-xl font-bold text-rose-600 mb-4">
                  Rp{product.harga.toLocaleString('id-ID')}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    Tambah
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada produk ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">Coba ubah filter pencarian Anda.</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-rose-50 border border-rose-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="flex-shrink-0 w-6 h-6 text-rose-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">Informasi Penting</h3>
              <div className="mt-2 text-sm text-rose-700">
                <p>
                  Saat ini halaman ini masih menampilkan data statis. 
                  Setelah integrasi database, produk akan ditampilkan secara dinamis dari tabel <code className="bg-rose-200 px-1 rounded">products</code> 
                  dengan fitur pencarian, filter kategori, dan pagination yang lengkap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}