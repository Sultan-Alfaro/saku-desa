'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ReceiptText, 
  ArrowDown, 
  ArrowUp, 
  PlusCircle, 
  Trash2, 
  Filter,
  Wrench, 
  Users, 
  Store,
  DollarSign,
  Wallet,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';

export default function RiwayatTransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'in' | 'out'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  async function fetchTransactions() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      setUser(userData.user);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false });

      if (!error && data) {
        setTransactions(data);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
    } else {
      alert('Gagal menghapus transaksi: ' + error.message);
    }
  };

  const getIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('infrastruktur') || cat.includes('operasional') || cat.includes('listrik') || cat.includes('air')) return Wrench;
    if (cat.includes('gaji') || cat.includes('upah') || cat.includes('karyawan') || cat.includes('warga')) return Users;
    if (cat.includes('bumdes') || cat.includes('penjualan') || cat.includes('stok') || cat.includes('usaha') || cat.includes('belanja')) return Store;
    if (cat.includes('hutang') || cat.includes('piutang') || cat.includes('pinjaman')) return Wallet;
    return DollarSign;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Kalkulasi total di filter yang aktif
  const totalIn = filteredTransactions
    .filter(t => t.type === 'in')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalOut = filteredTransactions
    .filter(t => t.type === 'out')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="p-6 flex flex-col gap-6 pb-24">
      
      {/* Header & Tombol Kembali */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h2>
            <p className="text-xs text-gray-500">Semua catatan keuangan UMKM & Warga</p>
          </div>
        </div>
        <Link 
          href="/dashboard/transaksi" 
          className="bg-[#0f4d3c] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#0a382c] transition shadow-sm"
        >
          <PlusCircle size={16} />
          <span>Catat Baru</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-200 p-1 rounded-xl flex text-xs font-bold">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-2.5 rounded-lg transition-all ${
            filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Semua ({transactions.length})
        </button>
        <button
          onClick={() => setFilterType('in')}
          className={`flex-1 py-2.5 rounded-lg transition-all ${
            filterType === 'in' ? 'bg-white text-[#0f4d3c] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => setFilterType('out')}
          className={`flex-1 py-2.5 rounded-lg transition-all ${
            filterType === 'out' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Ringkasan Filter Aktif */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Masuk</p>
            <p className="text-sm font-bold text-green-800 mt-0.5">{formatRupiah(totalIn)}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-green-700">
            <ArrowDown size={16} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Keluar</p>
            <p className="text-sm font-bold text-red-600 mt-0.5">{formatRupiah(totalOut)}</p>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-red-600">
            <ArrowUp size={16} />
          </div>
        </div>
      </div>

      {/* Daftar Transaksi */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Memuat daftar transaksi...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Belum ada transaksi di filter ini.
          </div>
        ) : (
          filteredTransactions.map((trx, index) => {
            const Icon = getIcon(trx.category);
            const isLast = index === filteredTransactions.length - 1;
            const formattedDate = new Date(trx.date).toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            });

            return (
              <div 
                key={trx.id} 
                className={`flex items-center justify-between p-4 hover:bg-gray-50/60 transition ${!isLast ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${trx.type === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{trx.note || trx.category || 'Transaksi'}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <span className="font-medium">{trx.category}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${trx.type === 'in' ? 'text-green-800' : 'text-gray-900'}`}>
                    {trx.type === 'in' ? '+' : '-'}{formatRupiah(trx.amount)}
                  </span>
                  <button 
                    onClick={() => handleDelete(trx.id)}
                    className="text-gray-300 hover:text-red-500 p-1 rounded transition"
                    title="Hapus transaksi"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
