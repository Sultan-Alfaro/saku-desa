"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const router = useRouter();

  const handleDaftar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) setPesan("❌ Gagal mendaftar: " + error.message);
    else setPesan("✅ Berhasil mendaftar! Cek email untuk verifikasi.");
    setLoading(false);
  };

  const handleMasuk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setPesan("❌ Gagal masuk: " + error.message);
    } else {
      setPesan("✅ Berhasil masuk! Mengalihkan...");
      router.push("/dashboard"); // Mengarahkan ke halaman utama/dashboard
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-black px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Saku Desa</h1>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="warga@desa.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          {pesan && (
            <p className="text-sm font-medium text-center text-blue-600 bg-blue-50 p-2 rounded">
              {pesan}
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleMasuk}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
            <button
              type="button"
              onClick={handleDaftar}
              disabled={loading}
              className="flex-1 border border-blue-600 text-blue-600 p-2 rounded hover:bg-blue-50 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}