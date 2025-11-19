'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  nama: string;
  slug?: string | null;
  icon?: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: '', slug: '', icon: '' });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate slug otomatis
  const generateSlug = (nama: string) => {
    return nama
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nama = e.target.value;
    setForm({ ...form, nama, slug: generateSlug(nama) });
  };

  // Buka modal untuk tambah baru
  const openAddModal = () => {
    setEditingId(null);
    setForm({ nama: '', slug: '', icon: '' });
    setIsModalOpen(true);
  };

  // Buka modal untuk edit
  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      nama: cat.nama,
      slug: cat.slug || '',
      icon: cat.icon || '',
    });
    setIsModalOpen(true);
  };

  // Tutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ nama: '', slug: '', icon: '' });
  };

  // Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) return toast.error('Nama kategori wajib diisi');

    const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.nama.trim(),
          slug: form.slug || null,
          icon: form.icon || null,
        }),
      });

      if (res.ok) {
        toast.success(editingId ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan');
        closeModal();
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      toast.error('Gagal menyimpan kategori');
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Gagal menghapus');
      }
    } catch (err) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Kategori</h1>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium shadow-md"
          >
            + Tambah Kategori
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Belum ada kategori</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((cat, i) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{i + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.nama}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cat.slug || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cat.icon ? (cat.icon.startsWith('http') ? '🖼️' : cat.icon) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-4">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="text-rose-600 hover:text-rose-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Semua di sini, tanpa component baru */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={handleNamaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Contoh: Makanan Ringan"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (otomatis)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="makanan-ringan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji / URL)</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="🍔 atau https://..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium"
                  >
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}