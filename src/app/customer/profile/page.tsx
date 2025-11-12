'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
}

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function CustomerProfile() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchUserProfile();
    }
  }, [session, status]);

  const fetchUserProfile = async () => {
    try {
      // For now, we'll use session data and extend it
      // In a real app, you'd fetch from /api/users/profile
      if (session?.user) {
        const userData: UserProfile = {
          id: parseInt(session.user.id || '0'),
          name: session.user.name || '',
          email: session.user.email || '',
          phone: '',
          address: '',
          dateOfBirth: '',
          gender: '',
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        setProfileForm({
          name: userData.name,
          phone: userData.phone || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!profileForm.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }
    if (profileForm.phone && !/^[0-9+\-\s()]+$/.test(profileForm.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setSuccessMessage('Profil berhasil diperbarui!');
        
        // Update session with new name if changed
        if (profileForm.name !== session?.user?.name) {
          await update({ name: profileForm.name });
        }
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || 'Gagal memperbarui profil' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Terjadi kesalahan saat memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user?.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccessMessage('Password berhasil diperbarui!');
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || 'Gagal memperbarui password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ general: 'Terjadi kesalahan saat memperbarui password' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please login to access profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Profil Saya</h1>
        <p className="text-blue-100">Kelola informasi akun dan keamanan</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informasi Profil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ubah Password
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informasi Akun
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nomor telepon"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Saat Ini *
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password saat ini"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru *
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password baru"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Minimal 6 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru *
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Konfirmasi password baru"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Memperbarui...' : 'Perbarui Password'}
                </button>
              </div>
            </form>
          )}

          {/* Account Info Tab */}
          {activeTab === 'account' && user && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
                    {user.email}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Email tidak dapat diubah</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Bergabung
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Akun
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Aktif
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      Customer
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Informasi Penting
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Untuk mengubah email atau menghapus akun, silakan hubungi customer service kami.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}