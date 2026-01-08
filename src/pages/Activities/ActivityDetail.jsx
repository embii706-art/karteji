import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission } from '../../config/roles'
import { generateAttendanceQR, getAttendanceStats } from '../../utils/attendance'
import QRCode from 'qrcode'

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activities, members, updateActivity } = useApp()
  const [activity, setActivity] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [qrImage, setQrImage] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const canEdit = hasPermission(user?.role, 'EDIT_ACTIVITY')
  const canDelete = hasPermission(user?.role, 'DELETE_ACTIVITY')
  const canManageAttendance = hasPermission(user?.role, 'MANAGE_ATTENDANCE')

  useEffect(() => {
    const foundActivity = activities.find(a => a.id === id)
    if (foundActivity) {
      setActivity(foundActivity)
      setFormData(foundActivity)
      loadStats(foundActivity)
    } else {
      navigate('/activities')
    }
  }, [id, activities, navigate])

  const loadStats = async (activityData) => {
    const activityStats = await getAttendanceStats(activityData.id)
    setStats(activityStats)
  }

  const handleGenerateQR = async () => {
    try {
      const qrData = generateAttendanceQR(activity.id)
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2
      })
      setQrImage(qrCodeUrl)
      setShowQR(true)
    } catch (error) {
      alert('Gagal membuat QR Code: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateActivity(formData)
      setActivity(formData)
      setIsEditing(false)
      alert('Kegiatan berhasil diperbarui!')
    } catch (error) {
      alert('Gagal memperbarui kegiatan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Ubah status kegiatan menjadi "${newStatus}"?`)) return

    try {
      const updated = { ...activity, status: newStatus }
      await updateActivity(updated)
      setActivity(updated)
      setFormData(updated)
    } catch (error) {
      alert('Gagal mengubah status: ' + error.message)
    }
  }

  if (!activity) {
    return (
      <div className="animate-fade-in">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/activities')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Detail Kegiatan</h1>
      </div>

      {/* Activity Info Card */}
      <div className="card mb-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
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
                  value={formData.time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="input"
              >
                <option value="upcoming">Akan Datang</option>
                <option value="ongoing">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData(activity)
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{activity.title}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
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
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-lg">📅</span>
                <span>
                  {new Date(activity.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  {activity.time && ` • ${activity.time}`}
                </span>
              </div>
              {activity.location && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span className="text-lg">📍</span>
                  <span>{activity.location}</span>
                </div>
              )}
              <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-lg">📝</span>
                <span>{activity.description}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && activity.status !== 'completed' && activity.status !== 'cancelled' && (
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {activity.status === 'upcoming' && (
                  <button
                    onClick={() => handleStatusChange('ongoing')}
                    className="btn btn-primary flex-1"
                  >
                    Mulai Kegiatan
                  </button>
                )}
                {activity.status === 'ongoing' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="btn btn-primary flex-1"
                  >
                    Selesaikan Kegiatan
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="btn btn-secondary"
                >
                  Batalkan
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* QR Code and Attendance */}
      {canManageAttendance && (activity.status === 'upcoming' || activity.status === 'ongoing') && (
        <div className="card mb-6">
          <h3 className="font-bold text-lg mb-4">Absensi</h3>
          {!showQR ? (
            <button
              onClick={handleGenerateQR}
              className="btn btn-primary w-full"
            >
              Generate QR Code Absensi
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src={qrImage} alt="QR Code" className="w-64 h-64 mx-auto" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scan QR code ini untuk absensi
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `qr-${activity.title.replace(/\s+/g, '-')}.png`
                    link.href = qrImage
                    link.click()
                  }}
                  className="btn btn-secondary flex-1"
                >
                  💾 Download
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="btn btn-secondary flex-1"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendance Statistics */}
      {stats && (
        <div className="card mb-6">
          <h3 className="font-bold text-lg mb-4">Statistik Kehadiran</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Hadir</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tidak Hadir</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Persentase</div>
            </div>
          </div>

          {stats.attendees.length > 0 && (
            <>
              <h4 className="font-medium mb-3">Daftar Hadir ({stats.attendees.length})</h4>
              <div className="space-y-2">
                {stats.attendees.map(attendance => {
                  const member = members.find(m => m.id === attendance.memberId)
                  return (
                    <div key={attendance.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {member?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{member?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(attendance.timestamp).toLocaleTimeString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <span className="text-green-600">✓</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ActivityDetail
