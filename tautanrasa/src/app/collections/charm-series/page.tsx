// src/app/collections/charm-series/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';

export default function CharmSeriesPage() {
  // CHARM SERIES products from your data
  const products = [
    {
      name: "Tautan Rasa Charm Era - Ballerina Grace",
      price: "Rp177.000",
      colors: "Available in multiple colors",
      href: "https://id.shp.ee/hHmUcgC",
      image: "Tautan Rasa - Ballerina Grace.png"
    },
    {
      name: "Tautan Rasa Charm Era - Ocean Bloom",
      price: "Rp187.000", 
      colors: "Available in multiple colors",
      href: "https://id.shp.ee/hHmUcgC",
      image: "Tautan Rasa - Ocean Bloom.png"
    },
    {
      name: "Tautan Rasa Charm Era - Amora Rose",
      price: "Rp182.000",
      colors: "Available in multiple colors",
      href: "https://id.shp.ee/hHmUcgC",
      image: "Tautan Rasa - Amora Rose.png"
    },
    {
      name: "Tautan Rasa Charm Era - Cherry Blossom",
      price: "Rp182.000",
      colors: "Available in multiple colors",
      href: "https://id.shp.ee/hHmUcgC",
      image: "Tautan Rasa - Cherry Blossom.png"
    },
    {
      name: "Tautan Rasa Charm Era - Secret Petal",
      price: "Rp182.000",
      colors: "Available in multiple colors",
      href: "https://id.shp.ee/hHmUcgC",
      image: "Tautan Rasa - Secret Petal.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header / Navbar - Same as homepage */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-3 px-4 md:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-black tracking-wide">
            TAUTAN RASA
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 xl:space-x-12 text-sm font-medium text-gray-700">
            <Link href="/#new-arrival" className="hover:text-black transition-colors">
              NEW LAUNCHING
            </Link>
            <Link href="/#best-seller" className="hover:text-black transition-colors">
              BEST SELLER
            </Link>
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">IDR Rp <span className="font-bold">▽</span></span>
            
            {/* Search Input - Desktop */}
            <SearchInput className="hidden md:flex" />
            
            {/* Search Button - Mobile */}
            <button className="md:hidden p-2 text-gray-700 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHARM SERIES</span>
          </nav>
        </div>
      </div>

      {/* Collection Header */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">CHARM SERIES</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi elegan dengan sentuhan mempesona. Rangkaian fashion premium yang menghadirkan kemewahan dan keanggunan dalam setiap detail.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product, index) => (
              <Link key={index} href={product.href} className="group block product-card">
                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={`/img/${product.image}`}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 
                      className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2" 
                      data-product-name={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="text-lg md:text-xl font-bold text-red-600 mb-1">{product.price}</p>
                    <p className="text-xs md:text-sm text-gray-500">{product.colors}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Same as homepage */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            {/* Brand Info */}
            <div className="col-span-2">
              <h3 className="text-xl md:text-2xl font-bold mb-4">TAUTAN RASA</h3>
              <p className="text-sm md:text-base text-gray-300 mb-4 max-w-sm">
                Tautan Rasa, under Airlangga University students, is a creative fashion brand that brings together innovative design with local Indonesian craftsmanship.
              </p>
              <div className="flex space-x-4">
                <Link href="https://www.tiktok.com/@tautanrasa.co?_t=zs-8zxy3jc3abc&_r=1" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">TikTok</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </Link>
                <Link href="mailto:hello.tautanrasa@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Email</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </Link>
                <Link href="https://id.shp.ee/c3uFHLf" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Shopee</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Information Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">INFORMATION</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="https://maps.google.com/maps?q=Universitas+Airlangga+Kampus+C" className="hover:text-white transition-colors">Our Location</Link></li>
                <li><Link href="/#news" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="/#about-tautan-rasa" className="hover:text-white transition-colors">Company Profile</Link></li>
                <li><Link href="https://67d17c3e03b85.site123.me/versions/2/include/external_redirect.php?websiteID=10455972&url=https%3A%2F%2Fwa.me%2F6285800240504" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Get In Touch & Help */}
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">GET IN TOUCH</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="https://www.tiktok.com/@tautanrasa.co?_t=zs-8zxy3jc3abc&_r=1" className="hover:text-white transition-colors">TikTok</Link></li>
                <li><Link href="mailto:hello.tautanrasa@gmail.com" className="hover:text-white transition-colors">Email</Link></li>
                <li><Link href="https://id.shp.ee/c3uFHLf" className="hover:text-white transition-colors">Shopee</Link></li>
              </ul>
              
              <h4 className="font-semibold mt-6 mb-3 text-sm md:text-base">HELP CENTER</h4>
              <Link 
                href="https://67d17c3e03b85.site123.me/versions/2/include/external_redirect.php?websiteID=10455972&url=https%3A%2F%2Fwa.me%2F6285800240504" 
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                </svg>
                WhatsApp Chat
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; 2025 - TAUTAN RASA | Web by <span className="text-white">D IV Informatics Engineering Student, Airlangga University</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}