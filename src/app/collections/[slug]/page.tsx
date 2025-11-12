'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  nama: string;
  harga: number;
  gambar: string;
  deskripsi: string;
}

interface Category {
  id: number;
  nama: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  is_active: boolean;
  product_count: number;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch all categories and find by slug
        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        const foundCategory = categories.find((cat: Category) => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
          
          // TODO: Fetch products in this category when products API is ready
          // const productsResponse = await fetch(`/api/products?category=${slug}`);
          // const productsData = await productsResponse.json();
          // setProducts(productsData);
          
          // Mock products for now
          setProducts([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori tidak ditemukan</h1>
          <p className="text-gray-600 mb-6">Kategori yang Anda cari mungkin sudah tidak tersedia</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4 md:px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Beranda
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/#categories" className="text-blue-600 hover:text-blue-800">
              Kategori
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600">{category.nama}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-64 md:h-96">
        <Image
          src={category.image}
          alt={category.nama}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.nama}</h1>
            <p className="text-lg md:text-xl max-w-2xl">{category.description}</p>
            <div className="mt-4 text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              {category.product_count} Produk Tersedia
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Produk {category.nama}</h2>
            
            {/* Filter/Sort Options - TODO: Implement later */}
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Urutkan: Terbaru</option>
                <option>Harga: Rendah ke Tinggi</option>
                <option>Harga: Tinggi ke Rendah</option>
                <option>Nama: A-Z</option>
              </select>
            </div>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={product.gambar}
                      alt={product.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.nama}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.deskripsi}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-rose-600">
                        Rp {product.harga.toLocaleString('id-ID')}
                      </span>
                      <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Beli</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Produk Segera Hadir</h3>
              <p className="text-xl text-gray-600 mb-8">
                Koleksi {category.nama} sedang dalam persiapan
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Ingin mendapat notifikasi saat produk tersedia?
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Beritahu Saya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Categories */}
          <div className="text-center mt-12 pt-8 border-t">
            <Link 
              href="/#categories"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Lihat Kategori Lainnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}