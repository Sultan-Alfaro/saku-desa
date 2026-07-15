import Link from 'next/link';
import { Landmark, User, Lock, LogIn, HelpCircle } from 'lucide-react';

export default function LoginPage() {
  return (
    // Latar belakang luar (Desktop)
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
      
      {/* Cangkang HP khusus halaman login */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-xl flex flex-col">
        
        {/* Bagian Ilustrasi Atas */}
        {/* Menggunakan gambar pemandangan sawah dari Unsplash sebagai ilustrasi sementara */}
        <div className="h-56 w-full bg-gray-300 relative">
          <img 
            src="https://images.unsplash.com/photo-1596422846543-74c6fb698205?auto=format&fit=crop&q=80&w=800" 
            alt="Ilustrasi Desa" 
            className="w-full h-full object-cover rounded-b-3xl shadow-sm"
          />
          {/* Efek gradasi agar menyatu dengan bagian bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Bagian Form */}
        <div className="flex-1 px-6 py-6 flex flex-col">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <Landmark size={44} className="text-[#0f4d3c] mb-3" />
            <h1 className="text-2xl font-bold text-[#0f4d3c] leading-tight">
              Selamat Datang di Saku Desa
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Solusi keuangan cerdas untuk warga.
            </p>
          </div>

          {/* Form Input */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1">Username / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Masukkan username Anda"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-[#0f4d3c] focus:border-[#0f4d3c] block w-full pl-10 p-3.5 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  placeholder="Masukkan password Anda"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-[#0f4d3c] focus:border-[#0f4d3c] block w-full pl-10 p-3.5 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Tombol Masuk */}
          {/* Di-link kembali ke '/' sebagai simulasi proses login berhasil */}
          <Link href="/" className="bg-[#0f4d3c] text-white font-bold rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-[#0a382c] transition shadow-sm w-full mb-8">
            Masuk
            <LogIn size={20} />
          </Link>

          {/* Spacer untuk mendorong area footer ke bagian paling bawah layar */}
          <div className="flex-1"></div>

          {/* Footer Links */}
          <div className="flex justify-between items-center text-sm font-bold text-gray-600 border-t border-gray-100 pt-6 mt-4 pb-4">
            <Link href="#" className="hover:text-[#0f4d3c] transition">Lupa Password?</Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-[#0f4d3c] transition">
              <HelpCircle size={16} />
              Bantuan
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}