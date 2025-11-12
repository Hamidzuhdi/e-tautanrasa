// src/components/NavigationButtons.tsx
'use client';

import Link from 'next/link';

interface NavigationButtonsProps {
  className?: string;
  onClose?: () => void; // untuk mobile menu
}

export default function NavigationButtons({ className = "", onClose }: NavigationButtonsProps) {
  return (
    <nav className={className}>
      <Link
        href="/products"
        className="hover:text-black transition-colors"
        onClick={onClose}
      >
        PRODUK
      </Link>
      <Link
        href="/categories"
        className="hover:text-black transition-colors"
        onClick={onClose}
      >
        KATEGORI
      </Link>
      <Link
        href="/#about-tautan-rasa"
        className="hover:text-black transition-colors"
        onClick={onClose}
      >
        TENTANG KAMI
      </Link>
      <Link
        href="/#news"
        className="hover:text-black transition-colors"
        onClick={onClose}
      >
        BERITA
      </Link>
    </nav>
  );
}