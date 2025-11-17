// src/components/NavigationButtons.tsx
'use client';

import Link from 'next/link';

interface NavigationButtonsProps {
  className?: string;
  onClose?: () => void; // untuk mobile menu
}

export default function NavigationButtons({ className = "", onClose }: NavigationButtonsProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose?.(); // tutup menu kalau ada
    }
  };

  return (
    <nav className={className}>
      <Link
        href="/#new-arrival"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('new-arrival');
        }}
        className="hover:text-black transition-colors"
      >
        NEW LAUNCHING
      </Link>
      <Link
        href="/#best-seller"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('best-seller');
        }}
        className="hover:text-black transition-colors"
      >
        BEST SELLER
      </Link>
    </nav>
  );
}