'use client';

import { useEffect, useState } from 'react';
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
  Store,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [pemasukanBulanIni, setPemasukanBulanIni] = useState(0);
  const [pengeluaranBulanIni, setPengeluaranBulanIni] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    const userId = userData.user.id;

    // Ambil semua transaksi user
    const { data: transData, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!error && transData) {
      setTransactions(transData.slice(0, 5)); // 5 transaksi terakhir

      let totalSaldo = 0;
      let inBulanIni = 0;
      let outBulanIni = 0;

      const bulanSekarang = new Date().getMonth();
      const tahunSekarang = new Date().getFullYear();

      transData.forEach((trx) => {
        const trxDate = new Date(trx.date);
        const isBulanIni = trxDate.getMonth() === bulanSekarang && trxDate.getFullYear() === tahunSekarang;
        const amount = Number(trx.amount);

        if (trx.type === 'in') {
          totalSaldo += amount;
          if (isBulanIni) inBulanIni += amount;
        } else {
          totalSaldo -= amount;
          if (isBulanIni) outBulanIni += amount;
        }
      });

      setSaldo(totalSaldo);
      setPemasukanBulanIni(inBulanIni);
      setPengeluaranBulanIni(outBulanIni);
    }
    setLoading(false);
  };

  const getIcon = (category) => {
    if (category?.toLowerCase().includes('infrastruktur')) return Wrench;
    if (category?.toLowerCase().includes('operasional')) return Users;
    if (category?.toLowerCase().includes('bumdes') || category?.toLowerCase().includes('penjualan')) return Store;
    return DollarSign;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      
      {/* 1. KARTU TOTAL SALDO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-500 tracking-wider mb-1">TOTAL SALDO</p>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{formatRupiah(saldo)}</h2>
        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
          <TrendingUp size={14} className="text-black" />
          <span>Berdasarkan seluruh transaksi</span>
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
          <p className="text-lg font-bold text-green-900">{formatRupiah(pemasukanBulanIni)}</p>
        </div>
        
        {/* Pengeluaran */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="bg-red-50 w-8 h-8 rounded-full flex items-center justify-center mb-3">
            <ArrowUp size={18} className="text-red-600" />
          </div>
          <p className="text-[11px] text-gray-500 font-medium mb-1">Pengeluaran Bulan Ini</p>
          <p className="text-lg font-bold text-red-600">{formatRupiah(pengeluaranBulanIni)}</p>
        </div>
      </div>

      {/* 3. TOMBOL AKSI */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/transaksi?type=in" className="bg-[#0f4d3c] text-white rounded-xl py-3 px-2 flex items-center justify-center gap-2 hover:bg-[#0a382c] transition">
          <PlusCircle size={18} />
          <span className="text-sm font-semibold">Catat Pemasukan</span>
        </Link>
        <Link href="/dashboard/transaksi?type=out" className="bg-blue-50 border border-blue-100 text-slate-900 rounded-xl py-3 px-2 flex items-center justify-center gap-2 hover:bg-blue-100 transition">
          <MinusCircle size={18} />
          <span className="text-sm font-semibold">Catat Pengeluaran</span>
        </Link>
      </div>

      {/* 4. TRANSAKSI TERAKHIR */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">Transaksi Terakhir</h3>
          <Link href="/dashboard/transaksi" className="text-sm font-semibold text-blue-600 hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Memuat transaksi...</div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">Belum ada transaksi.</div>
          ) : (
            transactions.map((trx, index) => {
              const Icon = getIcon(trx.category);
              const isLast = index === transactions.length - 1;
              const formattedDate = new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
              
              return (
                <div key={trx.id} className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${trx.type === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{trx.note || trx.category || 'Transaksi'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formattedDate} • {trx.category}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${trx.type === 'in' ? 'text-green-900' : 'text-gray-900'}`}>
                    {trx.type === 'in' ? '+' : '-'}{formatRupiah(trx.amount)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}