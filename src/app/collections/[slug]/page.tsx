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
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: selectedProduct.id,
          qty: quantity
        })
      });

      if (response.ok) {
        alert('Produk berhasil ditambahkan ke keranjang!');
        closeModal();
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menambahkan ke keranjang');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Terjadi kesalahan saat menambahkan ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

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
                    onClick={() => openModal(product)}
                    className="w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Lihat Detail
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

      {/* Product Detail Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Detail Produk</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product Details */}
            <div className="p-6">
              {/* Product Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedProduct.foto1 && (
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.foto1}
                      alt={selectedProduct.nama}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {selectedProduct.foto2 && (
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.foto2}
                      alt={`${selectedProduct.nama} - foto 2`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!selectedProduct.foto1 && !selectedProduct.foto2 && (
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-6xl">📷</span>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.nama}</h4>
                  <p className="text-sm text-gray-500 font-mono">Slug: {selectedProduct.slug}</p>
                </div>
                
                {selectedProduct.deskripsi && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Deskripsi:</h5>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.deskripsi}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Harga:</h5>
                    <p className="text-2xl font-bold text-rose-600">
                      Rp {Number(selectedProduct.harga).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Stok:</h5>
                    <p className={`text-lg font-medium ${
                      selectedProduct.stok > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedProduct.stok} unit
                      {selectedProduct.stok === 0 && (
                        <span className="block text-sm text-red-500">Stok habis</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              {selectedProduct.stok > 0 ? (
                <>
                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stok, quantity + 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        disabled={quantity >= selectedProduct.stok}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maksimal {selectedProduct.stok} item
                    </p>
                  </div>

                  {/* Total */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-rose-600 text-xl">
                        Rp {(Number(selectedProduct.harga) * quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium text-center">
                    ⚠️ Produk ini sedang tidak tersedia
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Tutup
                </button>
                {selectedProduct.stok > 0 && (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 py-3 px-6 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {addingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}