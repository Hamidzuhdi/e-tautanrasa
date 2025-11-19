'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
}

interface Category {
  id: number;
  nama: string;
  slug: string;
  icon: string | null;
}

export default function CollectionPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string).trim();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch category by slug
        const categoryRes = await fetch('/api/categories');
        if (categoryRes.ok) {
          const categories = await categoryRes.json();
          console.log('Search slug:', `"${slug}"`);
          console.log('Available slugs:', categories.map((c: Category) => `"${c.slug}"`));
          const foundCategory = categories.find((cat: Category) => cat.slug === slug);
          
          if (!foundCategory) {
            setError('Kategori tidak ditemukan');
            return;
          }
          
          setCategory(foundCategory);
          
          // Fetch products by category using optimized API
          const productsRes = await fetch(`/api/products/by-category/${foundCategory.id}`);
          if (productsRes.ok) {
            const categoryProducts = await productsRes.json();
            setProducts(categoryProducts);
          }
        }
      } catch (err) {
        setError('Gagal memuat data');
        console.error('Error fetching collection data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header placeholder */}
        <div className="h-16 bg-gray-100 animate-pulse"></div>
        
        {/* Hero section placeholder */}
        <div className="h-64 bg-gray-200 animate-pulse"></div>
        
        {/* Products grid placeholder */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-8">{error || 'Halaman tidak ditemukan'}</p>
          <Link 
            href="/" 
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
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

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-left">
            <div className="flex items-center mb-4">
              {category.icon && (
                <span className="text-4xl mr-4">{category.icon}</span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {category.nama}
              </h1>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl">
              Jelajahi koleksi {category.nama.toLowerCase()} terbaru kami dengan design yang elegan dan berkualitas tinggi.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-rose-600">Beranda</Link>
          <span>/</span>
          <span className="text-gray-900">Koleksi</span>
          <span>/</span>
          <span className="text-rose-600 font-medium">{category.nama}</span>
        </div>
      </nav>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Produk {category.nama}
          </h2>
          <p className="text-gray-600">
            {products.length} produk ditemukan
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600 mb-8">
              Koleksi {category.nama} akan segera hadir. Pantau terus untuk update terbaru!
            </p>
            <Link 
              href="/" 
              className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Lihat Koleksi Lain
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="aspect-square relative overflow-hidden">
                  {product.foto1 ? (
                    <Image
                      src={product.foto1}
                      alt={product.nama}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                  
                  {/* Stock badge */}
                  {product.stok === 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Habis
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                    {product.nama}
                  </h3>
                  
                  {product.deskripsi && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.deskripsi}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-rose-600">
                      Rp {Number(product.harga).toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stok: {product.stok}
                    </span>
                  </div>
                  
                  <button 
                    className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                      product.stok > 0 
                        ? 'bg-rose-600 text-white hover:bg-rose-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={product.stok === 0}
                  >
                    {product.stok > 0 ? 'Lihat Detail' : 'Stok Habis'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Tautan Rasa</h3>
          <p className="text-gray-400 mb-6">
            Handcrafted jewelry with meaningful stories
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Beranda
            </Link>
            <Link href="/#news" className="text-gray-400 hover:text-white transition-colors">
              News
            </Link>
            <Link href="/#best-seller" className="text-gray-400 hover:text-white transition-colors">
              Best Seller
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
            © 2024 Tautan Rasa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}