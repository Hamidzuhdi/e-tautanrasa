// src/app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchInput from '@/components/SearchInput';
import NavigationButtons from '@/components/NavigationButtons';
import MobileMenu from '@/components/MobileMenu';

// Hero Carousel Component
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    '/img/1.png',
    '/img/3.png', 
    '/img/4.png',
    '/img/5.png',
    '/img/6.png'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full">
      {/* Images */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedNews, setSelectedNews] = useState<null | 'collection' | 'collaboration' | 'workshop' | 'gallery'>(null);
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header / Navbar (Top Navigation) */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-3 px-4 md:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="text-2xl md:text-3xl font-bold text-black tracking-wide">
              TAUTAN RASA
            </div>
            
            {/* Desktop Navigation - Simplified to 2 menus */}
            <NavigationButtons className="hidden lg:flex space-x-8 xl:space-x-12 text-sm font-medium text-gray-700" />

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">IDR Rp <span className="font-bold">▽</span></span>
              <SearchInput className="flex" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xl font-bold text-black tracking-wide">
                TAUTAN RASA
              </div>
              <MobileMenu />
            </div>
            {/* Mobile Search */}
            <SearchInput className="w-full" />
          </div>
        </div>
      </header>
      
      {/* Top Banner (Payment Info) */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-xs md:text-sm font-medium">
        BATAS PEMBAYARAN 15 MENIT SETELAH MENERIMA INVOICE
      </div>

      {/* Main Hero Carousel Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          <HeroCarousel />
        </div>
        
        {/* Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 max-w-7xl mx-auto flex items-center p-4 md:p-12 z-20">
          <div className="text-left max-w-md text-white">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none drop-shadow-2xl">
              Her
            </h1>
            <h2 className="text-2xl md:text-3xl font-light italic mt-[-5px] md:mt-[-10px] drop-shadow-lg">
              You Story
            </h2>
            <p className="mt-4 md:mt-8 text-sm md:text-base font-light drop-shadow-md">
              Every piece tells a story. Where memories become eternal through the beauty of preserved flowers, creating jewelry that speaks to your soul.
            </p>
            <div className="mt-6 md:mt-8">
              <Link 
                href="/collections/charm-series"
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 font-medium"
              >
                Explore Collection
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 to-purple-100/30"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200/40 to-rose-300/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200/40 to-pink-300/40 rounded-full blur-xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About Tautan Rasa
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-purple-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-purple-500 p-4 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 text-center font-light tracking-wide">
              <span className="font-semibold text-rose-600">Tautan Rasa</span> is handmade jewelry that immortalizes real flowers. We use real flowers combined with high-quality clear resin to prevent cloudiness, and hypoallergenic stainless steel that&apos;s safe for skin. We&apos;re not just selling jewelry; we&apos;re capturing personal stories in wearable works of art.
            </p>
            
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - What They Said About Tautan Rasa */}
      <section className="bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50 py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-pink-100/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200/40 to-purple-300/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-200/40 to-rose-300/40 rounded-full blur-xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              What They Said About Tautan Rasa
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Real stories from our beloved customers who found their perfect piece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Customer Image */}
              <div className="aspect-square relative">
                <Image
                  src="/img/111.jpg"
                  alt="Customer 1"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed text-center">
                  &ldquo;Produknya bagus, suka bunga di dalamnya clear aku suka edelweiss biru. Mau beli lagii ngga sabar new model karenaa bisa di adjust buat tanganku yang kecil ini.&rdquo;
                </p>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                  <p className="font-semibold text-gray-800 text-center">Melisa cst TR.</p>
                  <p className="text-sm text-gray-600 text-center">One Of Our Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Customer Image */}
              <div className="aspect-square relative">
                <Image
                  src="/img/222.jpg"
                  alt="Customer 2"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed text-center">
                  &ldquo;Gelang super cantik simpel tapi elegan. Aku suka detail bunga mawar di dalamnya plus di kelilingi sprinkle yang makin tampak mewah. Perfect daily wear🫶🏻&rdquo;
                </p>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                  <p className="font-semibold text-gray-800 text-center">Indah Mashita cst TR</p>
                  <p className="text-sm text-gray-600 text-center">Student Airlangga University</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Customer Image */}
              <div className="aspect-square relative">
                <Image
                  src="/img/333.jpg"
                  alt="Customer 3"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed text-center">
                  &ldquo;Aku pake ini di acara Google kemarin. Banyak yang notice di gelang aku karena detail kelopak bunga plum putih di dalamnya. Cocok dipaduin sama rantai silver yang look lowkey but have meanings🫰🏻&rdquo;
                </p>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                  <p className="font-semibold text-gray-800 text-center">Cahyani cst TR</p>
                  <p className="text-sm text-gray-600 text-center">Loyal Customer Tautan Rasa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Advantages Section */}
      <section className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose TAUTAN RASA?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              At TAUTAN RASA, every piece is more than just an accessory — it&apos;s a story of care, craftsmanship, and connection.
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Handmade with Love */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-pink-400">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">🌸</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Handmade with Love</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Each petal is carefully handcrafted, capturing the natural beauty of real flowers in timeless form.
              </p>
            </div>

            {/* Gentle for Every Skin */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Gentle for Every Skin</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We use titanium hypoallergenic materials, making our jewelry safe and comfortable — the perfect choice for sensitive skin.
              </p>
            </div>

            {/* Quality You Can Trust */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-rose-400">
              <div className="flex items-center mb-4">
                <div className="bg-rose-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Quality You Can Trust</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction means everything to us. That&apos;s why every piece comes with a 1-month guarantee — because beauty should last, just like our connection with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Launching Section (Atala Skirt) - Based on 00:02-00:05 */}
      <section id="new-arrival" className="py-8 md:py-12 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900">
            New Launching - Drawstring Collection
          </h2>
          {/* Grid optimized for many items in the video */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 justify-items-center">
            {[
              'Pinkies Bumb', 'Moonlit Silvermist', 'Couple Black Light', 'Bloom Stripe Clamp (White Bone)', 'Bloom Stripe Clamp (Maroon)', 'Bloom Stripe Clamp (Milo)', 'Bloom Stripe (Navy)', 
              'Bloom Stripe (Mauve)', 'Bloom Stripe (Brown)'
            ].map((productName, index) => {
              // Generate image path based on product name with special handling for naming inconsistencies
              let imagePath = `/img/Tautan Rasa - ${productName}.png`;
              
              // Handle special case for "Bloom Stripe Clamp (Milo)" which has "Bllom" in filename
              if (productName === 'Bloom Stripe Clamp (Milo)') {
                imagePath = '/img/Tautan Rasa - Bllom Stripe Clamp (Milo).png';
              }
              // Handle special case for "Bloom Stripe Clamp (White Bone)" which has "Bllom" in filename
              if (productName === 'Bloom Stripe Clamp (White Bone)') {
                imagePath = '/img/Tautan Rasa - Bllom Stripe Clamp (White Bone).png';
              }
              
              // Generate href based on product name mapping
              let productHref = `/products/tautan-rasa-${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              
              // Map specific products to Shopee links
              if (productName === 'Pinkies Bumb') {
                productHref = 'https://id.shp.ee/C3QXqMn';
              } else if (productName === 'Moonlit Silvermist') {
                productHref = 'https://id.shp.ee/togM5cm';
              } else if (productName === 'Couple Black Light') {
                productHref = 'https://id.shp.ee/ENbe6Kg';
              } else if (productName.includes('Bloom Stripe Clamp')) {
                productHref = 'https://id.shp.ee/wK1NgyB';
              } else if (productName.includes('Bloom Stripe (')) {
                productHref = 'https://id.shp.ee/Dq7dLdo';
              }
              
              return (
                <Link 
                  key={index} 
                  href={productHref} 
                  className="text-center group hover:opacity-80 transition-opacity duration-200 w-full"
                >
                  <div className="aspect-[3/4] w-full bg-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <a href={productHref}>
                      <Image
                        src={imagePath}
                        alt={`Tautan Rasa ${productName}`}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </a>
                  </div>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-700 font-medium" data-product-name={`Tautan Rasa ${productName}`}>{productName}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Launching Section 2 (Charm Series) - 100% FIX: NO BLLOM, NO 404 */}
<section className="py-8 md:py-12 px-4 md:px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900">
      Charm Series
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 justify-items-center">
      {[
        'Ballerina Grace',
        'Ocean Bloom',
        'Amora Rose',
        'Cherry Blossom',
        'Secret Petal'
      ].map((productName, index) => {
        // PAKAI NAMA FILE YANG SAMA DENGAN JUDUL → TIDAK ADA BLLOM
        const imagePath = `/img/Tautan Rasa - ${productName}.png`;

        return (
          <Link
            key={index}
            href="https://id.shp.ee/hHmUcgC"
            className="text-center group hover:opacity-80 transition-opacity duration-200 w-full"
          >
            <div className="aspect-[3/4] w-full bg-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Image
                src={imagePath}
                alt={`Tautan Rasa ${productName}`}
                width={300}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-700 font-medium" data-product-name={`Tautan Rasa ${productName} Charm Series`}>
              {productName}
            </p>
          </Link>
        );
      })}
    </div>
  </div>
</section>

      {/* News Section - Full Height with Overlay */}
      <section id='news' className="bg-gray-800 text-white py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-yellow-400">
            OUR JOURNEY
          </h2>
          <p className="text-sm md:text-base mb-6 max-w-2xl mx-auto">
            A glimpse into the shared journey—where your stories, moments, and inspirations become part of our handcrafted jewelry collections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            <div 
              className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden shadow-xl group h-64 md:h-80"
              onClick={() => setSelectedNews('collection')}
            >
              {/* Background Image */}
              <Image 
                src="/img/lomba fesyar BI.jpg" 
                alt="New Collection" 
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-600/70 to-purple-400/50 group-hover:from-purple-900/95 transition-all duration-300"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white z-10">
                <h3 className="text-lg md:text-xl font-bold mb-2">Innovation That Speaks From The Heart</h3>
                <p className="text-xs opacity-90 mb-2">
                  Al Akbar National Mosque
                </p>
                <p className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full inline-block font-bold self-start">
                  14 Sept 2025
                </p>
              </div>
            </div>
            
            <div 
              className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden shadow-xl group h-64 md:h-80"
              onClick={() => setSelectedNews('collaboration')}
            >
              {/* Background Image */}
              <Image 
                src="/img/p2mw.jpg" 
                alt="Collaboration" 
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-600/70 to-blue-400/50 group-hover:from-teal-900/95 transition-all duration-300"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white z-10">
                <h3 className="text-lg md:text-xl font-bold mb-2">Where Our Dreams Took Root</h3>
                <p className="text-xs opacity-90 mb-2">
                  Airlangga University
                </p>
                <p className="text-xs bg-white text-teal-600 px-2 py-1 rounded-full inline-block font-bold self-start">
                  18 July 2025
                </p>
              </div>
            </div>

            <div 
              className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden shadow-xl group h-64 md:h-80"
              onClick={() => setSelectedNews('workshop')}
            >
              {/* Background Image */}
              <Image 
                src="/img/kodam.jpg" 
                alt="Workshop" 
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-600/70 to-emerald-400/50 group-hover:from-green-900/95 transition-all duration-300"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white z-10">
                <h3 className="text-lg md:text-xl font-bold mb-2">Empowering Women, Sharing Stories</h3>
                <p className="text-xs opacity-90 mb-2">
                  Military Regional Brawijaya
                </p>
                <p className="text-xs bg-white text-green-600 px-2 py-1 rounded-full inline-block font-bold self-start">
                  27 Sept 2025
                </p>
              </div>
            </div>

            <div 
              className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden shadow-xl group h-64 md:h-80"
              onClick={() => setSelectedNews('gallery')}
            >
              {/* Background Image */}
              <Image 
                src="/img/depan.jpg" 
                alt="Gallery" 
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-600/70 to-amber-400/50 group-hover:from-orange-900/95 transition-all duration-300"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white z-10">
                <h3 className="text-lg md:text-xl font-bold mb-2">Connected Through Beauty</h3>
                <p className="text-xs opacity-90 mb-2">
                  Photo gallery
                </p>
                <p className="text-xs bg-white text-orange-600 px-2 py-1 rounded-full inline-block font-bold self-start">
                  Gallery
                </p>
              </div>
            </div>


          </div>
          <p className="text-xl md:text-2xl font-bold mt-6">Latest Updates <span className="text-yellow-400">Fresh Stories!</span></p>
          <p className="text-sm md:text-base font-light italic">Follow our journey of crafting meaningful jewelry</p>
        </div>
      </section>

      {/* Best Seller Section - Based on 00:09-00:12 */}
      <section id="best-seller" className="py-8 md:py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900">
            Best Seller
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Produk 1: Bloom Stripe Mauve */}
            <Link href="https://id.shp.ee/Dq7dLdo" className="group block product-card">
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <a href="https://id.shp.ee/Dq7dLdo">
                    <Image
                      src="/img/Tautan Rasa - Bloom Stripe (Mauve).png"
                      alt="Bloom Stripe Mauve"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2" data-product-name="Lowee Pants - Celana Panjang Kantor Polos Trendy Wanita">
                    Soft Plum Flower
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-red-600">Rp140.000</p>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-1">Rope in Mauve</p>
                </div>
              </div>
            </Link>

            {/* Produk 2: Bloom Stripe Calm */}
            <Link href="https://id.shp.ee/wK1NgyB" className="group block">
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <a href="https://id.shp.ee/wK1NgyB">
                    <Image
                      src="/img/Tautan Rasa - Bloom Stripe Clamp (Maroon).png"
                      alt="Bloom Stripe Calmp"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
                    Bloom Stripe Clamp - Rosse Flower
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-red-600">Rp165.000</p>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-1">New Clamp Charm</p>
                </div>
              </div>
            </Link>

            {/* Produk 3: Mariposa Dream */}
            <Link href="https://shopee.co.id/product/1498500791/42220245010?d_id=9f44f" className="group block">
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <a href="https://shopee.co.id/product/1498500791/42220245010?d_id=9f44f">
                    <Image
                      src="/img/Tautan Rasa-Mariposa Dream.png"
                      alt="Mariposa Dream"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
                    Forget Me Not Flower - Gold Titanium Grade A
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-red-600">Rp190.000</p>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-1">Feminim, Charm, Classy</p>
                </div>
              </div>
            </Link>

            {/* Produk 4: Elyra Classic Chain */}
            <Link href="https://id.shp.ee/x2yUtC7" className="group block">
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <a href="https://id.shp.ee/x2yUtC7">
                    <Image
                      src="/img/Tautan Rasa-Elyra Classic Chain.png"
                      alt="Elyra Classic Chain"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
                    Her New Modesty
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-red-600">Rp197.000</p>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-1">support 4 charm feeling blue</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline Section - Based on 00:12 */}
      <div className="bg-gray-100 py-6 md:py-8 text-center px-4">
        <p className="text-xl md:text-3xl font-serif italic text-gray-800">
          Where Every Flowers Tell a Story
        </p>
      </div>
    
      {/* Shop by Categories - Based on 00:13-00:14 */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900">
            Shop by Categories
          </h2>
          {/* 3 Main Categories - Larger Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'CHARM SERIES', href: '/collections/charm-series', description: 'Koleksi elegan dengan sentuhan mempesona' },
              { name: 'TAUT SERIES', href: '/collections/taut-series', description: 'Rangkaian fashion yang terhubung harmonis' },
              { name: 'DRAWSTRING COLLECTION', href: '/collections/drawstring-collection', description: 'Kenyamanan bertemu dengan gaya modern' }
            ].map((category) => (
              <Link 
                key={category.name} 
                href={category.href} 
                className="group block overflow-hidden rounded-xl relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-[4/5] relative">
                  <a href={category.href}>
                    <Image
                      src={`/img/LOGO BRAND TAUTAN RASA.jpg?text=${category.name.replace(' ', '%20')}`}
                      alt={category.name}
                      width={600}
                      height={750}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </a>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide group-hover:text-yellow-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm md:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-yellow-400 font-medium">
                      <span className="mr-2">Lihat Koleksi</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* You May Also Like / Products Section - Based on 00:15 */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900">
        You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 1. Ammi Pink Ace */}
        <Link href="https://id.shp.ee/YJ8wZXg" className="group block">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] relative overflow-hidden">
          <a href="https://id.shp.ee/YJ8wZXg">
            <Image
              src="/img/Tautan Rasa-Ammi Pink Ace.png"
              alt="Ammi Pink Ace"
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
            </div>
            <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
            Feminim, Sporty, and Classy.
          </h3>
          <p className="text-lg md:text-xl font-bold text-red-600">Rp170.000</p>
            </div>
          </div>
        </Link>

        {/* 2. Fleur Forever */}
        <Link href="https://id.shp.ee/Pg7xFeo" className="group block">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] relative overflow-hidden">
          <a href="https://id.shp.ee/Pg7xFeo">
            <Image
              src="/img/Tautan Rasa-Fleur Forever.png"
              alt="Fleur Forever"
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
            </div>
            <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
            Gold Titanium Grade A
          </h3>
          <p className="text-lg md:text-xl font-bold text-red-600">Rp190.000</p>
            </div>
          </div>
        </Link>

        {/* 3. Mariposa Dream */}
        <Link href="https://shopee.co.id/product/1498500791/42220245010?d_id=9f44f" className="group block">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] relative overflow-hidden">
          <a href="https://shopee.co.id/product/1498500791/42220245010?d_id=9f44f">
            <Image
              src="/img/Tautan Rasa-Mariposa Dream.png"
              alt="Mariposa Dream"
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
            </div>
            <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
            Feminim, Charm, and Classy
          </h3>
          <p className="text-lg md:text-xl font-bold text-red-600">Rp. 190.000</p>
            </div>
          </div>
        </Link>
        
        {/* 4. Blue Plum Blossom */}
        <Link href="https://id.shp.ee/bpFvcZS" className="group block">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] relative overflow-hidden">
          <a href="https://id.shp.ee/bpFvcZS">
            <Image
              src="/img/Tautan Rasa-Blue Plum Blossom.png"
              alt="Blue Plum Blossom"
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
            </div>
            <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
            The Stars On Grace
          </h3>
          <p className="text-lg md:text-xl font-bold text-red-600">Rp115.000</p>
            </div>
          </div>
        </Link>
        { /* 5. Elyra Classic Chain */}
        <Link href="https://id.shp.ee/x2yUtC7" className="group block">
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[3/4] relative overflow-hidden">
          <a href="https://id.shp.ee/x2yUtC7">
            <Image
              src="/img/Tautan Rasa-Elyra Classic Chain.png"
              alt="Elyra Classic Chain"
              width={300}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
            </div>
            <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium mb-2 text-gray-900 line-clamp-2">
            Her New Modesty - Support 4 Charm Feeling Blue
          </h3>
          <p className="text-lg md:text-xl font-bold text-red-600">Rp197.000</p>
            </div>
          </div>
        </Link>
          </div>
        </div>
      </section>



      {/* Footer - Based on 00:18-00:19 */}
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
                {/* Social Media Icons - TikTok, Email, Shopping Bag */}
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

            {/* Get In Touch */}
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

          <div className="border-t border-gray-700 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; 2025 - TAUTAN RASA | Web by <span className="text-white">D IV Informatics Engineering Student, Airlangga University</span></p>
          </div>
        </div>
      </footer>

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedNews === 'collection' && 'New Spring Collection'}
                  {selectedNews === 'collaboration' && 'Artist Collaboration'}
                  {selectedNews === 'workshop' && 'Crafting Workshop'}
                  {selectedNews === 'gallery' && 'CUSTOMER SEGMENTS'}
                </h3>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {selectedNews === 'gallery' ? (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      '/img/11.jpg',
                      '/img/22.jpg',
                      '/img/33.jpg',
                      '/img/44.jpg',
                      '/img/55.jpg',
                      '/img/444.jpg'
                    ].map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <Image 
                          src={image}
                          alt={`Gallery Image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <Image 
                    src={
                      selectedNews === 'collection' ? '/img/lomba fesyar BI.jpg' : 
                      selectedNews === 'collaboration' ? '/img/p2mw.jpg' : 
                      selectedNews === 'workshop' ? '/img/kodam.jpg' : 
                      '/img/depan.jpg'
                    } 
                    alt={
                      selectedNews === 'collection' ? 'Innovation that speaks from the heart' : 
                      selectedNews === 'collaboration' ? 'Where our dreams took root' : 
                      selectedNews === 'workshop' ? 'Empowering women, sharing stories' : 
                      'Gallery'
                    } 
                    width={600}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {selectedNews === 'collection' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    At the FESYAR BI Festival, we proudly earned recognition for a business innovation grounded in purpose and meaning
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">Published: September 14, 2025</p>
                </div>
              )}
              
              {selectedNews === 'collaboration' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Through the P2MW Program, we nurtured our entrepreneurial spirit and learned to turn ideas into action.
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">Published: July 18, 2025</p>
                </div>
              )}

              {selectedNews === 'workshop' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    We also collaborated with Ibu Chrisma Virawanti, B.A., Ibu Tri Siwi Agustina, SE., M.Si., and Persit Kodam Brawijaya, sharing stories and creativity in the spirit of women’s empowerment.
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">Published: September 27, 2025</p>
                </div>
              )}

              {selectedNews === 'gallery' && (
                <div>
                  <p className="text-gray-600 text-center">
                    TAUTAN RASA has found its place in many hearts — embraced by diverse communities who appreciate beauty, meaning, and craftsmanship.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}