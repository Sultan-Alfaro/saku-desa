"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { Landmark, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState({ text: "", type: "" }); // type: 'success' | 'error'
  const router = useRouter();

  const handleMasuk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan({ text: "", type: "" });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setPesan({ text: "Gagal masuk: " + error.message, type: "error" });
    } else {
      setPesan({ text: "Berhasil masuk! Mengalihkan ke dashboard...", type: "success" });
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleDaftar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan({ text: "", type: "" });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName || email.split("@")[0],
        },
      },
    });

    if (error) {
      setPesan({ text: "Gagal mendaftar: " + error.message, type: "error" });
    } else {
      setPesan({ text: "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau langsung login.", type: "success" });
      setTimeout(() => setView("login"), 2500);
    }
    setLoading(false);
  };

  const handleLupaPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan({ text: "", type: "" });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/page",
    });

    if (error) {
      setPesan({ text: "Gagal mengirim tautan: " + error.message, type: "error" });
    } else {
      setPesan({ text: "Tautan reset password telah dikirim ke email Anda!", type: "success" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-xl flex flex-col justify-between overflow-x-hidden">
        
        {/* Atas: Header Hero Banner & Switcher */}
        <div>
          {/* Header Banner Melengkung */}
          <div className="bg-[#0f4d3c] px-6 pt-12 pb-14 text-center text-white relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -left-12 -top-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20 shadow-inner">
              <Landmark className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Saku Desa</h1>
            <p className="text-xs text-green-100/90 mt-1 font-medium">Bantu Kelola Keuangan UMKM & Warga</p>
          </div>

          {/* Tab Switcher Floating */}
          <div className="-mt-7 mx-6 bg-white p-1.5 rounded-2xl shadow-lg border border-gray-100 flex z-10 relative">
            <button
              type="button"
              onClick={() => { setView("login"); setPesan({ text: "", type: "" }); }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                view === "login"
                  ? "bg-[#0f4d3c] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => { setView("register"); setPesan({ text: "", type: "" }); }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                view === "register"
                  ? "bg-[#0f4d3c] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Daftar Baru
            </button>
          </div>
        </div>

        {/* Tengah: Form Body */}
        <div className="px-6 py-6 flex-1 flex flex-col justify-center">
          
          {/* Notifikasi Pesan */}
          {pesan.text && (
            <div
              className={`flex items-start gap-2.5 p-4 rounded-2xl text-xs font-medium mb-5 shadow-sm ${
                pesan.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {pesan.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{pesan.text}</span>
            </div>
          )}

          {/* 1. VIEW LOGIN */}
          {view === "login" && (
            <form onSubmit={handleMasuk} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setPesan({ text: "", type: "" }); }}
                    className="text-xs font-semibold text-[#0f4d3c] hover:underline cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="Masukkan password Anda"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-[#0f4d3c] text-white font-bold rounded-xl py-4 px-4 flex items-center justify-center gap-2 hover:bg-[#0a382c] active:scale-[0.98] transition shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>{loading ? "Memproses..." : "Masuk ke Saku Desa"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* 2. VIEW REGISTER (DAFTAR) */}
          {view === "register" && (
            <form onSubmit={handleDaftar} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Nama Lengkap / Nama Usaha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="Contoh: Budi Santoso / Toko Kue Budi"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="warga@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Buat Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-[#0f4d3c] text-white font-bold rounded-xl py-4 px-4 flex items-center justify-center gap-2 hover:bg-[#0a382c] active:scale-[0.98] transition shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>{loading ? "Mendaftarkan..." : "Daftar Akun Sekarang"}</span>
              </button>
            </form>
          )}

          {/* 3. VIEW FORGOT PASSWORD */}
          {view === "forgot" && (
            <form onSubmit={handleLupaPassword} className="flex flex-col gap-4">
              <div className="text-center mb-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-[#0f4d3c] rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <KeyRound size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Atur Ulang Password</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Masukkan alamat email yang terdaftar untuk menerima tautan reset password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Email Terdaftar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4d3c] focus:border-transparent transition shadow-sm"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#0f4d3c] text-white font-bold rounded-xl py-4 px-4 flex items-center justify-center gap-2 hover:bg-[#0a382c] active:scale-[0.98] transition shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>{loading ? "Mengirim..." : "Kirim Tautan Reset"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setView("login"); setPesan({ text: "", type: "" }); }}
                className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-gray-800 text-center transition cursor-pointer"
              >
                ← Kembali ke halaman Masuk
              </button>
            </form>
          )}

        </div>

        {/* Bawah: Footer Info */}
        <div className="px-6 py-5 bg-white/60 border-t border-gray-200/60 text-center">
          <p className="text-[11px] text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Saku Desa. Diperuntukkan bagi UMKM & Warga.
          </p>
        </div>

      </div>
    </div>
  );
}