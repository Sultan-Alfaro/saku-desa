import BottomNav from '../../components/BottomNav';
import { Landmark } from 'lucide-react'; 

export default function DashboardLayout({ children }) {
  return (
    // INI ADALAH BUNGKUS UTAMA YANG WAJIB ADA (Satu div paling luar)
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
      
      {/* Cangkang HP maksimal lebar md (432px) */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-xl pb-20">
        
        {/* Header Saku Desa */}
        <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <Landmark className="w-6 h-6 text-green-900" />
          <h1 className="text-xl font-bold text-green-900">Saku Desa</h1>
        </header>

        {/* Area Konten Utama */}
        <main>
          {children}
        </main>

        <BottomNav />
        
      </div>
    </div>
  );
}