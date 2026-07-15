import Link from 'next/link';
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
  return (
    <div className="p-6 flex flex-col gap-6 pb-8">
      
      {/* 1. INFO PROFIL (Foto, Nama, Nomor HP) */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-3">
          <img 
            src="https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=200" 
            alt="Foto Profil Pak Budi" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Pak Budi</h2>
        <p className="text-sm text-gray-500 font-medium">+62 812-3456-7890</p>
      </div>

      {/* 2. STATISTIK PENGGUNA (Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-600 mb-1">
            <ReceiptText size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Total Transaksi</span>
          </div>
          <p className="text-lg font-bold text-gray-900">1,240</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-600 mb-1">
            <CalendarDays size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Lama Bergabung</span>
          </div>
          <p className="text-lg font-bold text-gray-900">2 Tahun</p>
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
      <Link href="/login" className="mt-4 flex items-center justify-center gap-2 text-red-600 font-bold py-4 hover:bg-red-50 rounded-xl transition">
        <LogOut size={20} />
        Keluar
      </Link>

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
