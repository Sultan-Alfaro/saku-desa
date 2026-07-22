'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Plus, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function HutangPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalHutang, setTotalHutang] = useState(0);
  const [totalPiutang, setTotalPiutang] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('debt');
  const [formDate, setFormDate] = useState('');
  const [formNote, setFormNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchDebts() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      setUser(userData.user);
      
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false });
        
      if (!error && data) {
        setRecords(data);
        
        let hutang = 0;
        let piutang = 0;
        
        data.forEach(item => {
          if (item.status === 'Belum Lunas') {
            if (item.type === 'debt') hutang += Number(item.amount);
            else piutang += Number(item.amount);
          }
        });
        
        setTotalHutang(hutang);
        setTotalPiutang(piutang);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDebts();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSimpan = async () => {
    if (!formName || !formAmount || !formDate) {
      alert('Mohon isi nama, nominal, dan tanggal.');
      return;
    }
    
    setSubmitting(true);
    
    const { error } = await supabase.from('debts').insert([{
      user_id: user.id,
      name: formName,
      amount: parseFloat(formAmount),
      type: formType,
      status: 'Belum Lunas',
      date: formDate,
      note: formNote
    }]);
    
    if (!error) {
      // Catat juga ke tabel transaksi agar muncul di Transaksi Terakhir di Dashboard & menambah akurasi saldo
      await supabase.from('transactions').insert([{
        user_id: user.id,
        amount: parseFloat(formAmount),
        type: formType === 'debt' ? 'in' : 'out',
        category: formType === 'debt' ? 'Pinjaman Masuk (Hutang)' : 'Pinjaman Keluar (Piutang)',
        date: formDate,
        note: `${formType === 'debt' ? 'Hutang dari' : 'Piutang ke'}: ${formName}${formNote ? ` (${formNote})` : ''}`
      }]);
    }
    
    setSubmitting(false);
    
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setIsModalOpen(false);
      setFormName('');
      setFormAmount('');
      setFormDate('');
      setFormNote('');
      fetchDebts();
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const getInitial = (name) => {
    if (!name) return '?';
    const split = name.trim().split(' ');
    if (split.length > 1) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Lunas' ? 'Belum Lunas' : 'Lunas';
    const { error } = await supabase.from('debts').update({ status: newStatus }).eq('id', id);
    if (!error) fetchDebts();
  };

  return (
    <div className="p-6 flex flex-col gap-6 relative min-h-[calc(100vh-140px)]">
      
      {/* 1. KARTU REKAP (Grid) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Hutang */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown size={16} className="text-red-600" />
            <p className="text-xs font-medium text-gray-700">Total Hutang</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatRupiah(totalHutang)}</p>
        </div>
        
        {/* Total Piutang */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp size={16} className="text-[#0f4d3c]" />
            <p className="text-xs font-medium text-gray-700">Total Piutang</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatRupiah(totalPiutang)}</p>
        </div>
      </div>

      {/* 2. DAFTAR CATATAN */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Daftar Catatan</h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Memuat catatan...</div>
          ) : records.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Belum ada catatan hutang/piutang.</div>
          ) : records.map((record, index) => {
            const isLast = index === records.length - 1;
            const isDebt = record.type === 'debt';
            const formattedDate = new Date(record.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            // Gunakan index warna berdasarkan id untuk konsistensi (opsional) atau warna tetap
            const colors = ['bg-blue-400', 'bg-[#0f4d3c]', 'bg-[#7a4843]', 'bg-orange-500', 'bg-purple-500'];
            const bgClass = colors[index % colors.length];
            
            return (
              <div key={record.id} className={`p-4 flex justify-between items-center ${!isLast ? 'border-b border-gray-200' : ''}`}>
                
                {/* Info Profil */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${bgClass}`}>
                    {getInitial(record.name)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{record.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formattedDate} • {record.note || (isDebt ? 'Hutang' : 'Piutang')}</p>
                  </div>
                </div>

                {/* Nominal & Badge Status */}
                <div className="flex flex-col items-end gap-1.5 cursor-pointer" onClick={() => toggleStatus(record.id, record.status)}>
                  <p className={`font-bold text-sm ${isDebt ? 'text-red-700' : 'text-[#0f4d3c]'}`}>
                    {formatRupiah(record.amount)}
                  </p>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    record.status === 'Lunas' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {record.status}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FLOATING ACTION BUTTON (FAB) */}
      <div className="fixed bottom-[88px] w-full max-w-md flex justify-end px-6 pointer-events-none">
        <button onClick={() => setIsModalOpen(true)} className="w-14 h-14 bg-[#0f4d3c] text-white rounded-2xl shadow-lg flex items-center justify-center pointer-events-auto hover:bg-[#0a382c] transition-transform hover:scale-105">
          <Plus size={28} />
        </button>
      </div>

      {/* MODAL TAMBAH DATA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Catat Hutang / Piutang</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-0.5">Jenis</label>
                <select 
                  value={formType} 
                  onChange={(e) => setFormType(e.target.value)} 
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent outline-none shadow-sm"
                >
                  <option value="debt" className="text-gray-900">Hutang (Saya Pinjam)</option>
                  <option value="receivable" className="text-gray-900">Piutang (Orang Pinjam)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-0.5">Nama Orang / Toko</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Budi / Toko Makmur" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent shadow-sm" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-0.5">Nominal (Rp)</label>
                <input 
                  type="number" 
                  placeholder="50000" 
                  value={formAmount} 
                  onChange={(e) => setFormAmount(e.target.value)} 
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-0.5">Tanggal</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-0.5">Catatan</label>
                <input 
                  type="text" 
                  placeholder="Pinjaman modal usaha..." 
                  value={formNote} 
                  onChange={(e) => setFormNote(e.target.value)} 
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent shadow-sm" 
                />
              </div>
            </div>

            <button onClick={handleSimpan} disabled={submitting} className="w-full bg-[#0f4d3c] text-white font-bold rounded-xl p-3.5 mt-5 flex justify-center items-center gap-2 hover:bg-[#0a382c] disabled:opacity-70 shadow-md">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan Catatan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}