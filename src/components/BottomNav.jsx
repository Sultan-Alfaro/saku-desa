'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'Transaksi', path: '/dashboard/transaksi', icon: ReceiptText },
    { name: 'Hutang', path: '/dashboard/hutang', icon: Wallet },
    { name: 'Profil', path: '/dashboard/profil', icon: User },
  ];

  return (
    // INI ADALAH BUNGKUS UTAMA UNTUK NAVIGASI (Satu div paling luar)
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link href={item.path} key={item.name} className="flex flex-col items-center gap-1">
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-[#0f4d3c] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] ${isActive ? 'font-bold text-[#0f4d3c]' : 'font-medium text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}