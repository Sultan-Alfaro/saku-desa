'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Transaksi', path: '/transaksi', icon: ReceiptText },
    { name: 'Hutang', path: '/hutang', icon: Wallet },
    { name: 'Profil', path: '/profil', icon: User },
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
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-blue-400 text-white' : 'text-gray-400'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-xs ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}