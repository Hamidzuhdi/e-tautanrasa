// src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  nama: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
}

export default function CategoriesAdmin() {
  // State untuk data kategori dari API
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    description: '',
    icon: ''
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingCategory) {
        // Update category
        response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            slug: formData.slug || formData.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            is_active: true
          })
        });
        
        if (response.ok) {
          const updatedCategory = await response.json();
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ));
        } else {
          const error = await response.json();
          alert(error.error || 'Gagal mengupdate kategori');
          return;
        }
      } else {
        // Add new category
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            slug: formData.slug || formData.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          })
        });
        
        if (response.ok) {
          const newCategory = await response.json();
          setCategories([...categories, newCategory]);
        } else {
          const error = await response.json();
          alert(error.error || 'Gagal menambah kategori');
          return;
        }
      }

      // Reset form
      setFormData({ nama: '', slug: '', description: '', icon: '' });
      setShowAddModal(false);
      setEditingCategory(null);
      
      // Tampilkan notifikasi sukses
      alert('Kategori berhasil disimpan! Akan otomatis muncul di halaman utama.');
      
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Gagal menyimpan kategori. Silakan coba lagi.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nama: category.nama,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCategories(categories.filter(cat => cat.id !== id));
          alert('Kategori berhasil dihapus');
        } else {
          const error = await response.json();
          alert(error.error || 'Gagal menghapus kategori');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Gagal menghapus kategori. Silakan coba lagi.');
      }
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => 
          cat.id === id ? updatedCategory : cat
        ));
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengubah status kategori');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Gagal mengubah status kategori. Silakan coba lagi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus kategori produk</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ nama: '', slug: '', description: '', icon: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {category.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.nama}</h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <button
                    onClick={() => toggleActive(category.id, category.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.is_active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.is_active ? 'Aktif' : 'Non-aktif'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Produk</span>
                  <span className="font-semibold text-gray-900">{category.product_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dibuat</span>
                  <span className="text-gray-500">
                    {new Date(category.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada kategori</h3>
          <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan kategori baru.</p>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setFormData({ nama: '', slug: '', description: '', icon: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama kategori"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-generate dari nama"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Kosongkan untuk auto-generate dari nama kategori
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi kategori (opsional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="🌸 (opsional)"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setFormData({ nama: '', slug: '', description: '', icon: '' });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}