import Link from 'next/link';
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  PlusCircle, 
  MinusCircle, 
  Wallet, 
  Wrench, 
  Users, 
  Store 
} from 'lucide-react';

export default function Home() {
  // Data dummy untuk list transaksi (bisa diganti dari database nantinya)
  const transactions = [
    { id: 1, title: 'Dana Desa Tahap 1', date: '12 Okt 2023', category: 'Pemasukan', amount: '+ Rp 5.000.000', type: 'in', icon: Wallet },
    { id: 2, title: 'Perbaikan Jalan Dusun', date: '10 Okt 2023', category: 'Infrastruktur', amount: '- Rp 2.500.000', type: 'out', icon: Wrench },
    { id: 3, title: 'Konsumsi Rapat Warga', date: '08 Okt 2023', category: 'Operasional', amount: '- Rp 450.000', type: 'out', icon: Users },
    { id: 4, title: 'Sewa Kios Desa', date: '05 Okt 2023', category: 'BUMDes', amount: '+ Rp 1.200.000', type: 'in', icon: Store },
  ];

  return (
    <div className="p-5 flex flex-col gap-5">
      
      {/* 1. KARTU TOTAL SALDO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-500 tracking-wider mb-1">TOTAL SALDO</p>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Rp 45.250.000</h2>
        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
          <TrendingUp size={14} className="text-black" />
          <span>+12% dari bulan lalu</span>
        </div>
      </div>

      {/* 2. KARTU PEMASUKAN & PENGELUARAN (GRID) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pemasukan */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="bg-green-50 w-8 h-8 rounded-full flex items-center justify-center mb-3">
            <ArrowDown size={18} className="text-green-700" />
          </div>
          <p className="text-[11px] text-gray-500 font-medium mb-1">Pemasukan Bulan Ini</p>
          <p className="text-lg font-bold text-green-900">Rp 8.500.000</p>
        </div>
        
        {/* Pengeluaran */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="bg-red-50 w-8 h-8 rounded-full flex items-center justify-center mb-3">
            <ArrowUp size={18} className="text-red-600" />
          </div>
          <p className="text-[11px] text-gray-500 font-medium mb-1">Pengeluaran Bulan Ini</p>
          <p className="text-lg font-bold text-red-600">Rp 3.200.000</p>
        </div>
      </div>

      {/* 3. TOMBOL AKSI */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/transaksi?type=in" className="bg-[#0f4d3c] text-white rounded-xl py-3 px-2 flex items-center justify-center gap-2 hover:bg-[#0a382c] transition">
          <PlusCircle size={18} />
          <span className="text-sm font-semibold">Catat Pemasukan</span>
        </Link>
        <Link href="/transaksi?type=out" className="bg-blue-50 border border-blue-100 text-slate-900 rounded-xl py-3 px-2 flex items-center justify-center gap-2 hover:bg-blue-100 transition">
          <MinusCircle size={18} />
          <span className="text-sm font-semibold">Catat Pengeluaran</span>
        </Link>
      </div>

      {/* 4. TRANSAKSI TERAKHIR */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">Transaksi Terakhir</h3>
          <Link href="/transaksi" className="text-sm font-semibold text-blue-600 hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {transactions.map((trx, index) => {
            const Icon = trx.icon;
            const isLast = index === transactions.length - 1;
            
            return (
              <div key={trx.id} className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${trx.type === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{trx.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{trx.date} • {trx.category}</p>
                  </div>
                </div>
                <div className={`font-bold text-sm ${trx.type === 'in' ? 'text-green-900' : 'text-gray-900'}`}>
                  {trx.amount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}