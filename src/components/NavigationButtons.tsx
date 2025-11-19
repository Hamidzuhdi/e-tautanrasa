// src/components/NavigationButtons.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationButtonsProps {
  className?: string;
  onClose?: () => void; // untuk mobile menu
}

export default function NavigationButtons({ className = "", onClose }: NavigationButtonsProps) {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    // Jika sedang berada di homepage (path === '/'), scroll biasa
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        onClose?.();
        return;
      }
    }

    // Jika bukan di homepage, arahkan dulu ke home + hash, lalu scroll setelah load
    router.push(`/#${sectionId}`);
    onClose?.();
  };

  const handleLoginClick = () => {
    router.push('/login');
    onClose?.(); // tutup mobile menu kalau sedang terbuka
  };

  return (
    <nav className={`flex items-center gap-8 ${className}`}>
      {/* Navigasi scroll ke section */}
      <Link
        href="/#new-arrival"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('new-arrival');
        }}
        className="text-gray-600 hover:text-black transition-colors font-medium"
      >
        NEW LAUNCHING
      </Link>

      <Link
        href="/#best-seller"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('best-seller');
        }}
        className="text-gray-600 hover:text-black transition-colors font-medium"
      >
        BEST SELLER
      </Link>

      {/* Spacer biar tombol Login selalu di paling kanan */}
      <div className="flex-1" />

      {/* Tombol Login */}
      <button
        onClick={handleLoginClick}
        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
      >
        Login
      </button>
    </nav>
  );
}