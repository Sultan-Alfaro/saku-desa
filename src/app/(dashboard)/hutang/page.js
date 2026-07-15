import { ArrowDown, ArrowUp, Plus } from 'lucide-react';

export default function HutangPage() {
  // Data dummy untuk daftar catatan hutang/piutang
  const records = [
    { 
      id: 1, initial: 'BS', name: 'Budi Santoso', date: '12 Okt 2023', 
      note: 'Pinjaman Modal', amount: 'Rp 500.000', 
      status: 'Belum Lunas', isDebt: true, bgInitial: 'bg-blue-400' 
    },
    { 
      id: 2, initial: 'SW', name: 'Siti Wahyuni', date: '05 Okt 2023', 
      note: 'Arisan Warga', amount: 'Rp 150.000', 
      status: 'Lunas', isDebt: false, bgInitial: 'bg-[#0f4d3c]' 
    },
    { 
      id: 3, initial: 'KT', name: 'Koperasi Tani', date: '28 Sep 2023', 
      note: 'Pupuk Subsidi', amount: 'Rp 750.000', 
      status: 'Belum Lunas', isDebt: true, bgInitial: 'bg-[#7a4843]' 
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 relative min-h-[calc(100vh-140px)]">
      
      {/* 1. KARTU REKAP (Grid) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Hutang */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown size={16} className="text-red-600" />
            <p className="text-xs font-medium text-gray-700">Total Hutang Saya</p>
          </div>
          <p className="text-lg font-bold text-gray-900">Rp 1.250.000</p>
        </div>
        
        {/* Total Piutang */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp size={16} className="text-[#0f4d3c]" />
            <p className="text-xs font-medium text-gray-700">Total Piutang</p>
          </div>
          <p className="text-lg font-bold text-gray-900">Rp 3.400.000</p>
        </div>
      </div>

      {/* 2. DAFTAR CATATAN */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Daftar Catatan</h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {records.map((record, index) => {
            const isLast = index === records.length - 1;
            
            return (
              <div key={record.id} className={`p-4 flex justify-between items-center ${!isLast ? 'border-b border-gray-200' : ''}`}>
                
                {/* Info Profil */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${record.bgInitial}`}>
                    {record.initial}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{record.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{record.date} • {record.note}</p>
                  </div>
                </div>

                {/* Nominal & Badge Status */}
                <div className="flex flex-col items-end gap-1.5">
                  <p className={`font-bold text-sm ${record.isDebt ? 'text-red-700' : 'text-[#0f4d3c]'}`}>
                    {record.amount}
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
      {/* Dibungkus pointer-events-none agar tidak menghalangi klik area sekitarnya */}
      <div className="fixed bottom-[88px] w-full max-w-md flex justify-end px-6 pointer-events-none">
        <button className="w-14 h-14 bg-[#0f4d3c] text-white rounded-2xl shadow-lg flex items-center justify-center pointer-events-auto hover:bg-[#0a382c] transition-transform hover:scale-105">
          <Plus size={28} />
        </button>
      </div>

    </div>
  );
}