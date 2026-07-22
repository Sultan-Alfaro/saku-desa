'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shapes, Calendar, FileText, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

function TransaksiForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initType = searchParams.get('type') === 'out' ? 'out' : 'in';

  const [type, setType] = useState(initType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  const handleSimpan = async () => {
    if (!amount || !category || !date) {
      alert('Mohon lengkapi nominal, kategori, dan tanggal.');
      return;
    }
    
    if (!user) {
      alert('Anda belum login.');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount: parseFloat(amount),
          type,
          category,
          date,
          note
        }
      ]);

    setLoading(false);
    
    if (error) {
      alert('Gagal menyimpan transaksi: ' + error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-full overflow-hidden min-w-0 box-border">
      
      {/* Header Halaman */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Catat Transaksi</h2>
        <p className="text-sm text-gray-500">Masukkan detail pemasukan atau pengeluaran</p>
      </div>

      {/* Tab Switcher (Pemasukan / Pengeluaran) */}
      <div className="bg-gray-200 p-1 rounded-xl flex max-w-full">
        <button
          onClick={() => { setType('in'); setCategory(''); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            type === 'in' 
              ? 'bg-white text-[#0f4d3c] shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => { setType('out'); setCategory(''); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            type === 'out' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Kotak Input Nominal */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center max-w-full min-w-0">
        <label className="text-xs font-bold text-gray-500 tracking-wider mb-4">NOMINAL TRANSAKSI</label>
        <div className="flex items-center justify-center gap-2 w-full max-w-full min-w-0">
          <span className="text-2xl font-bold text-gray-700 shrink-0">Rp</span>
          <input 
            type="number" 
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-5xl font-bold text-gray-700 outline-none w-full max-w-[250px] min-w-0 bg-transparent text-center focus:text-gray-900 placeholder:text-gray-300"
          />
        </div>
        <div className="w-16 h-1 bg-gray-200 rounded-full mt-4"></div>
      </div>

      {/* Form Detail Tambahan */}
      <div className="flex flex-col gap-4 max-w-full min-w-0 w-full">
        
        {/* Input Kategori */}
        <div className="w-full max-w-full min-w-0">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Kategori</label>
          <div className="relative w-full max-w-full min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Shapes size={18} className="text-gray-500" />
            </div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent block w-full max-w-full min-w-0 pl-11 pr-4 py-3.5 appearance-none shadow-sm outline-none box-border"
            >
              <option value="" disabled className="text-gray-400">Pilih kategori...</option>
              {type === 'in' ? (
                <>
                  <option value="Penjualan Produk / Jasa" className="text-gray-900">Penjualan Produk / Jasa (UMKM)</option>
                  <option value="Gaji / Upah Kerja" className="text-gray-900">Gaji / Upah Kerja</option>
                  <option value="Keuntungan Usaha / Investasi" className="text-gray-900">Keuntungan Usaha / Investasi</option>
                  <option value="Hadiah / Hibah / Pemberian" className="text-gray-900">Hadiah / Hibah / Pemberian</option>
                  <option value="Pinjaman Masuk" className="text-gray-900">Pinjaman Masuk</option>
                  <option value="Pemasukan Lainnya" className="text-gray-900">Pemasukan Lainnya</option>
                </>
              ) : (
                <>
                  <option value="Belanja Bahan / Stok Usaha" className="text-gray-900">Belanja Bahan / Stok Usaha (UMKM)</option>
                  <option value="Biaya Operasional (Listrik, Air, Internet)" className="text-gray-900">Biaya Operasional (Listrik, Air, Internet)</option>
                  <option value="Gaji Karyawan / Operasional Usaha" className="text-gray-900">Gaji Karyawan / Operasional Usaha</option>
                  <option value="Kebutuhan Rumah Tangga & Harian" className="text-gray-900">Kebutuhan Rumah Tangga & Harian</option>
                  <option value="Transportasi & Bensin" className="text-gray-900">Transportasi & Bensin</option>
                  <option value="Makanan & Minuman" className="text-gray-900">Makanan & Minuman</option>
                  <option value="Kesehatan & Pendidikan" className="text-gray-900">Kesehatan & Pendidikan</option>
                  <option value="Pengeluaran Lainnya" className="text-gray-900">Pengeluaran Lainnya</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Input Tanggal */}
        <div className="w-full max-w-full min-w-0">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Tanggal</label>
          <div className="relative w-full max-w-full min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-500" />
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent block w-full max-w-full min-w-0 pl-11 pr-3 py-3.5 shadow-sm outline-none box-border appearance-none" 
            />
          </div>
        </div>

        {/* Input Keterangan */}
        <div className="w-full max-w-full min-w-0">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Keterangan / Catatan</label>
          <div className="relative w-full max-w-full min-w-0">
            <div className="absolute top-3.5 left-3.5 pointer-events-none">
              <FileText size={18} className="text-gray-500" />
            </div>
            <textarea 
              rows="3" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tuliskan detail transaksi di sini..."
              className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm rounded-xl focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent block w-full max-w-full min-w-0 pl-11 pr-4 py-3.5 shadow-sm resize-none outline-none box-border"
            ></textarea>
          </div>
        </div>

      </div>

      {/* Tombol Simpan */}
      <button 
        onClick={handleSimpan}
        disabled={loading}
        className="bg-[#0f4d3c] text-white font-bold rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-[#0a382c] transition mt-2 shadow-sm disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
      </button>

    </div>
  );
}

export default function TransaksiPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Memuat form...</div>}>
      <TransaksiForm />
    </Suspense>
  );
}