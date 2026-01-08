import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { ROLE_NAMES } from '../../config/roles'
import { compressImage } from '../../utils/image'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { members } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    photo: user?.photo || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const compressed = await compressImage(file)
      setFormData(prev => ({ ...prev, photo: compressed }))
    } catch (error) {
      alert('Gagal memproses foto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateUser(formData)
      setIsEditing(false)
      alert('Profil berhasil diperbarui!')
    } catch (error) {
      alert('Gagal memperbarui profil: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const memberData = members.find(m => m.id === user?.memberId)

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={loading}
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-primary font-medium">{ROLE_NAMES[user?.role]}</p>
            {memberData && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID Anggota: {memberData.memberId}
              </p>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              Edit Profil
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || '',
                    photo: user?.photo || ''
                  })
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-lg">📧</span>
              <span>{user?.email || '-'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-lg">📱</span>
              <span>{user?.phone || '-'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-lg">📍</span>
              <span>{user?.address || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Member Stats */}
      {memberData && (
        <div className="card">
          <h3 className="font-bold mb-4">Statistik Keanggotaan</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {memberData.joinDate ? new Date().getFullYear() - new Date(memberData.joinDate).getFullYear() : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tahun Bergabung</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">{memberData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
