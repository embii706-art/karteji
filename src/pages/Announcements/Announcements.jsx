import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission, ROLE_NAMES } from '../../config/roles'

const Announcements = () => {
  const { user } = useAuth()
  const { announcements, addAnnouncement } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const canCreate = hasPermission(user?.role, 'CREATE_ANNOUNCEMENT')

  const filteredAnnouncements = announcements.filter(ann => {
    if (filter === 'all') return true
    return ann.priority === filter
  })

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pengumuman</h1>
        {canCreate && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            + Buat Pengumuman
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              onClick={() => setFilter(priority)}
              className={`px-4 py-2 rounded-lg ${
                filter === priority
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {priority === 'all' && 'Semua'}
              {priority === 'high' && '🔴 Penting'}
              {priority === 'medium' && '🟡 Sedang'}
              {priority === 'low' && '🟢 Biasa'}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-gray-600 dark:text-gray-400">Belum ada pengumuman</p>
          </div>
        ) : (
          sortedAnnouncements.map(announcement => (
            <div key={announcement.id} className="card">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">
                  {announcement.priority === 'high' && '🔴'}
                  {announcement.priority === 'medium' && '🟡'}
                  {announcement.priority === 'low' && '🟢'}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(announcement.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{announcement.content}</p>
              {announcement.author && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Oleh: {announcement.author}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddAnnouncementModal
          onClose={() => setShowAddModal(false)}
          onAdd={addAnnouncement}
          userName={user?.name}
        />
      )}
    </div>
  )
}

const AddAnnouncementModal = ({ onClose, onAdd, userName }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newAnnouncement = {
        ...formData,
        id: `announcement_${Date.now()}`,
        date: new Date().toISOString(),
        author: userName
      }
      
      await onAdd(newAnnouncement)
      alert('Pengumuman berhasil dibuat!')
      onClose()
    } catch (error) {
      alert('Gagal membuat pengumuman: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Buat Pengumuman</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Isi Pengumuman *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="input"
              rows={5}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prioritas</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="input"
            >
              <option value="low">🟢 Biasa</option>
              <option value="medium">🟡 Sedang</option>
              <option value="high">🔴 Penting</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Membuat...' : 'Buat Pengumuman'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Announcements
