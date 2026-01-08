import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission } from '../../config/roles'
import { exportActivities } from '../../utils/export'

const Activities = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activities, addActivity } = useApp()
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const canCreate = hasPermission(user?.role, 'CREATE_ACTIVITY')

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.status === filter
  })

  // Sort by date (newest first)
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kegiatan</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportActivities(activities)}
            className="btn btn-secondary"
            title="Export ke CSV"
          >
            📥 Export
          </button>
          {canCreate && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              + Buat Kegiatan
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' && 'Semua'}
              {status === 'upcoming' && 'Akan Datang'}
              {status === 'ongoing' && 'Berlangsung'}
              {status === 'completed' && 'Selesai'}
              {status === 'cancelled' && 'Dibatalkan'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">{activities.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {activities.filter(a => a.status === 'upcoming').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Akan Datang</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {activities.filter(a => a.status === 'ongoing').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Berlangsung</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-600">
            {activities.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Selesai</div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {sortedActivities.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'Belum ada kegiatan' : 'Tidak ada kegiatan dengan status ini'}
            </p>
          </div>
        ) : (
          sortedActivities.map(activity => (
            <div
              key={activity.id}
              onClick={() => navigate(`/activities/${activity.id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl">
                  📅
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold">{activity.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      activity.status === 'ongoing' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      activity.status === 'completed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {activity.status === 'upcoming' && 'Akan Datang'}
                      {activity.status === 'ongoing' && 'Berlangsung'}
                      {activity.status === 'completed' && 'Selesai'}
                      {activity.status === 'cancelled' && 'Dibatalkan'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(activity.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {activity.location && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {activity.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onAdd={addActivity}
        />
      )}
    </div>
  )
}

const AddActivityModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    status: 'upcoming'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newActivity = {
        ...formData,
        id: `activity_${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      
      await onAdd(newActivity)
      alert('Kegiatan berhasil dibuat!')
      onClose()
    } catch (error) {
      alert('Gagal membuat kegiatan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Buat Kegiatan Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Kegiatan *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waktu</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="input"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Membuat...' : 'Buat Kegiatan'}
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

export default Activities
