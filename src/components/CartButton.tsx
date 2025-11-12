// src/components/CartButton.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CartButton() {
  // Simulasi jumlah item di cart - nantinya akan menggunakan state management
  const [cartItemCount] = useState(3);

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-700 hover:text-black transition-colors"
      title="Keranjang Belanja"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" 
        />
      </svg>
      
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {cartItemCount > 9 ? '9+' : cartItemCount}
        </span>
      )}
    </Link>
  );
}