'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { 
  UserPen, 
  ShieldCheck, 
  Bell, 
  Globe, 
  HelpCircle, 
  ShieldAlert, 
  Info, 
  LogOut, 
  ChevronRight,
  ReceiptText,
  CalendarDays
} from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [lamaBergabung, setLamaBergabung] = useState('...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      setUser(userData.user);

      // Hitung Lama Bergabung
      const joinedDate = new Date(userData.user.created_at);
      const now = new Date();
      
      const diffTime = Math.abs(now - joinedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        setLamaBergabung(`${diffDays} Hari`);
      } else if (diffDays < 365) {
        setLamaBergabung(`${Math.floor(diffDays / 30)} Bulan`);
      } else {
        setLamaBergabung(`${Math.floor(diffDays / 365)} Tahun`);
      }

      // Hitung Total Transaksi
      const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.user.id);
        
      if (!error && count !== null) {
        setTotalTransaksi(count);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500 flex items-center justify-center min-h-[50vh]">Memuat profil...</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-6 pb-8">
      
      {/* 1. INFO PROFIL (Foto, Nama, Nomor HP) */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-3 bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-500">
          {user?.email?.[0].toUpperCase() || '?'}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user?.user_metadata?.name || 'Pengguna'}</h2>
        <p className="text-sm text-gray-500 font-medium">{user?.email || 'email@example.com'}</p>
      </div>

      {/* 2. STATISTIK PENGGUNA (Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-600 mb-1">
            <ReceiptText size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Total Transaksi</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{totalTransaksi}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-600 mb-1">
            <CalendarDays size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Lama Bergabung</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{lamaBergabung}</p>
        </div>
      </div>

      {/* 3. MENU PENGATURAN */}
      <div className="flex flex-col gap-5">
        
        {/* Kategori: AKUN */}
        <div>
          <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 ml-1">AKUN</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <MenuButton icon={UserPen} title="Ubah Profil" />
            <MenuButton icon={ShieldCheck} title="Keamanan Akun" isLast />
          </div>
        </div>

        {/* Kategori: APLIKASI */}
        <div>
          <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 ml-1">APLIKASI</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <MenuButton icon={Bell} title="Pengaturan Notifikasi" />
            <MenuButton icon={Globe} title="Bahasa" subtitle="Bahasa Indonesia" isLast />
          </div>
        </div>

        {/* Kategori: BANTUAN & INFO */}
        <div>
          <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 ml-1">BANTUAN & INFO</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <MenuButton icon={HelpCircle} title="Pusat Bantuan" />
            <MenuButton icon={ShieldAlert} title="Kebijakan Privasi" />
            <MenuButton icon={Info} title="Tentang Saku Desa" isLast />
          </div>
        </div>

      </div>

      {/* 4. TOMBOL KELUAR (LOGOUT) */}
      <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 text-red-600 font-bold py-4 hover:bg-red-50 rounded-xl transition cursor-pointer w-full text-center">
        <LogOut size={20} />
        Keluar
      </button>

    </div>
  );
}

// Komponen bantuan kecil untuk merapikan daftar menu
function MenuButton({ icon: Icon, title, subtitle, isLast }) {
  return (
    <button className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-700" strokeWidth={2.5} />
        <div className="text-left">
          <p className="font-bold text-sm text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}
