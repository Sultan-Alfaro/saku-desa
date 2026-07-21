'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import BottomNav from '../../components/BottomNav';
import { Landmark } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/');
      } else {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Memuat Saku Desa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-xl pb-20">
        <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <Landmark className="w-6 h-6 text-green-900" />
          <h1 className="text-xl font-bold text-green-900">Saku Desa</h1>
        </header>

        <main>
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}