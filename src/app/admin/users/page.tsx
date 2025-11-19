'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserForm from '@/components/admin/UserForm';
import Modal from '@/components/admin/Modal';

interface User {
  id: string;
  nama: string;      // FIX
  email: string | null;
  noHp: string;      // FIX
  alamat: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}


export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setErrorMessage('Gagal memuat data user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (formData: { name: string; email: string; password?: string; noHp?: string }) => {
    try {
      setIsFormLoading(true);
      setErrorMessage('');

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setSuccessMessage(
        editingUser
          ? 'User berhasil diupdate!'
          : 'User berhasil dibuat!'
      );

      setIsModalOpen(false);
      setEditingUser(null);
      await fetchUsers();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Save user error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal menyimpan user'
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsFormLoading(true);
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus user');
      }

      setSuccessMessage('User berhasil dihapus!');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      await fetchUsers();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Delete user error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal menghapus user'
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleOpenNewUserModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditUserModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Kelola semua akun admin TAUTAN RASA
              </p>
            </div>
            <button
              onClick={handleOpenNewUserModal}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New User
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-8 w-8 text-rose-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20h12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2h6z" />
              </svg>
              <p>{searchQuery ? 'User tidak ditemukan' : 'Belum ada user terdaftar'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {user.nama}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditUserModal(user)}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteConfirmOpen(true);
                            }}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingUser ? 'Edit User' : 'Add New User'}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
      >
        <UserForm
          user={
            editingUser
              ? { id: editingUser.id, name: editingUser.nama, email: editingUser.email ?? '', noHp: editingUser.noHp ?? '' }
              : null
          }
          onSubmit={handleSaveUser}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          isLoading={isFormLoading}
        />
      </Modal>

      {deleteConfirmOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hapus User</h3>
            </div>

            <p className="text-gray-600 mb-2">
              Apakah Anda yakin ingin menghapus user <strong>{userToDelete.nama}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ({userToDelete.email})
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
                disabled={isFormLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isFormLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isFormLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
