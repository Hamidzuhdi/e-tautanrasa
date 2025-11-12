// src/app/search/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Simulasi hasil pencarian (nanti ganti dari DB)
  const mockResults = [
    { name: 'Pinkies Bumb', slug: 'tautan-rasa-pinkies-bumb' },
    { name: 'Moonlit Silvermist', slug: 'tautan-rasa-moonlit-silvermist' },
    { name: 'Bloom Stripe Navy', slug: 'tautan-rasa-bloom-stripe-navy' },
    { name: 'Ballerina Grace', slug: 'tautan-rasa-ballerina-grace' },
    { name: 'Ocean Bloom', slug: 'tautan-rasa-ocean-bloom' },
    { name: 'Amora Rose', slug: 'tautan-rasa-amora-rose' },
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Hasil Pencarian: <span className="text-red-600">&ldquo;{query}&rdquo;</span>
        </h1>

        {mockResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockResults.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="bg-gray-100 rounded-lg aspect-[3/4] mb-3 group-hover:shadow-md transition-shadow overflow-hidden">
                  <Image 
                    src={`/img/Tautan Rasa - ${product.name}.png`}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-center group-hover:text-red-600">
                  {product.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">
            Produk tidak ditemukan. Coba kata kunci lain.
          </p>
        )}
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="bg-gray-200 rounded-lg aspect-[3/4]"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}