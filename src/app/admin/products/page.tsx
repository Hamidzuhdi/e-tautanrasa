'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';

// Tipe yang benar & aman
type Product = {
  id: number | string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  harga: number | string;
  stok: number;
  beratGram: number;
  isActive: boolean;
  foto1?: string | null;
  foto2?: string | null;
  kategori?: {
    id: number;
    nama: string;
  } | null;
};

type Category = {
  id: number;
  nama: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nama: '', kategoriId: '', deskripsi: '', harga: '', stok: '', beratGram: '', isActive: true, foto1: null as File | null, foto2: null as File | null
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (catRes.ok) setCategories(await catRes.json());
      } catch (err) {
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ nama: '', kategoriId: '', deskripsi: '', harga: '', stok: '', beratGram: '', isActive: true, foto1: null, foto2: null });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(Number(p.id));
    setForm({
      nama: p.nama,
      kategoriId: p.kategori && p.kategori.id ? String(p.kategori.id) : '',
      deskripsi: p.deskripsi || '',
      harga: String(p.harga),
      stok: String(p.stok),
      beratGram: String(p.beratGram),
      isActive: p.isActive,
      foto1: null,
      foto2: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.harga) return toast.error('Nama dan harga wajib diisi');

    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('kategoriId', form.kategoriId);
    formData.append('deskripsi', form.deskripsi);
    formData.append('harga', form.harga);
    formData.append('stok', form.stok);
    formData.append('beratGram', form.beratGram);
    formData.append('isActive', String(form.isActive));
    if (form.foto1) formData.append('foto1', form.foto1);
    if (form.foto2) formData.append('foto2', form.foto2);

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        toast.success(editingId ? 'Produk diupdate' : 'Produk ditambahkan');
        closeModal();
        setProducts(await (await fetch('/api/products')).json());
      } else {
        const err = await res.json();
        toast.error(err.message || 'Gagal menyimpan');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus produk ini?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Produk dihapus');
      setProducts(products.filter(p => p.id !== id));
    } else {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
          <button onClick={openAddModal} className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium">
            + Tambah Produk
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {p.foto1 ? <img src={p.foto1} alt="" className="w-16 h-16 object-cover rounded" /> : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium">{p.nama}</td>
                      <td className="px-6 py-4 text-sm">{p.kategori?.nama || '-'}</td>
                      <td className="px-6 py-4">Rp {Number(p.harga).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">{p.stok}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={() => openEditModal(p)} className="text-rose-600 hover:text-rose-800 mr-4">Edit</button>
                        <button onClick={() => handleDelete(Number(p.id))} className="text-red-600 hover:text-red-800">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={closeModal} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold">{editingId ? 'Edit' : 'Tambah'} Produk</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama Produk</label>
                      <input type="text" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori</label>
                      <select value={form.kategoriId} onChange={e => setForm({ ...form, kategoriId: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                        <option value="">Pilih kategori (opsional)</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Harga</label>
                      <input type="number" step="0.01" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stok</label>
                      <input type="number" value={form.stok} onChange={e => setForm({ ...form, stok: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Berat (gram)</label>
                      <input type="number" value={form.beratGram} onChange={e => setForm({ ...form, beratGram: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Status</label>
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5" />
                      <span>{form.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea rows={4} value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Foto Utama {form.foto1 && '(terpilih)'}</label>
                      <input type="file" accept="image/*" onChange={e => setForm({ ...form, foto1: e.target.files?.[0] || null })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Foto Tambahan {form.foto2 && '(terpilih)'}</label>
                      <input type="file" accept="image/*" onChange={e => setForm({ ...form, foto2: e.target.files?.[0] || null })} className="w-full" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Batal</button>
                    <button type="submit" className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}