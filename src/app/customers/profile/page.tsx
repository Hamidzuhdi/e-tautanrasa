'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  alamat: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    nama: '',
    email: '',
    noHp: '',
    alamat: '',
  });

  // Ambil data user saat halaman dibuka
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setUser(u);
        setForm({
          nama: u.nama,
          email: u.email,
          noHp: u.noHp,
          alamat: u.alamat || '',
        });
      } else {
        toast.error('Sesi berakhir, silakan login ulang');
        router.push('/login');
      }
    } catch (err) {
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.nama || !form.email || !form.noHp) {
    return toast.error('Nama, email, dan no HP wajib diisi');
  }

  setSaving(true);
  try {
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: form.nama.trim(),
        noHp: form.noHp.trim(),
        alamat: form.alamat.trim() || null,
      }),
    });

    if (res.ok) {
      toast.success('Profil berhasil diperbarui! 🎉', {
        duration: 3000,
        position: 'top-center',
      });

      // Delay sedikit biar toast keliatan, lalu redirect ke home
      setTimeout(() => {
        router.push('/');
      }, 800);
    } else {
      const err = await res.json();
      toast.error(err.message || 'Gagal menyimpan perubahan');
    }
  } catch (err) {
    toast.error('Terjadi kesalahan jaringan');
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {form.nama.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Profil</h1>
            <p className="text-gray-600 mt-2">Perbarui informasi akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-gray-50"
                required
                disabled // biasanya email tidak diubah
              />
              <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. Handphone</label>
              <input
                type="text"
                value={form.noHp}
                onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                placeholder="081234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea
                rows={4}
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none"
                placeholder="Jl. Contoh No.123, Kelurahan, Kecamatan, Kota, Provinsi"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold rounded-lg hover:from-rose-700 hover:to-purple-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}