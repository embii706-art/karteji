import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission } from '../../config/roles'
import { generateAttendanceQR, getAttendanceStats } from '../../utils/attendance'
import QRCode from 'qrcode'

const Attendance = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activities, members } = useApp()
  const [selectedActivity, setSelectedActivity] = useState('')
  const [qrData, setQrData] = useState('')
  const [qrImage, setQrImage] = useState('')
  const [stats, setStats] = useState(null)

  const canManage = hasPermission(user?.role, 'MANAGE_ATTENDANCE')

  // Get upcoming and ongoing activities
  const availableActivities = activities.filter(
    a => a.status === 'upcoming' || a.status === 'ongoing'
  ).sort((a, b) => new Date(a.date) - new Date(b.date))

  useEffect(() => {
    if (selectedActivity) {
      loadStats()
    }
  }, [selectedActivity])

  const loadStats = async () => {
    const activity = activities.find(a => a.id === selectedActivity)
    if (activity) {
      const activityStats = await getAttendanceStats(activity.id)
      setStats(activityStats)
    }
  }

  const handleGenerateQR = async () => {
    if (!selectedActivity) {
      alert('Pilih kegiatan terlebih dahulu')
      return
    }

    try {
      const data = generateAttendanceQR(selectedActivity)
      setQrData(data)
      
      const qrCodeUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrImage(qrCodeUrl)
    } catch (error) {
      alert('Gagal membuat QR Code: ' + error.message)
    }
  }

  const activity = activities.find(a => a.id === selectedActivity)

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Absensi Kegiatan</h1>
        {canManage && (
          <button
            onClick={() => navigate('/attendance/scan')}
            className="btn btn-primary"
          >
            📷 Scan QR
          </button>
        )}
      </div>

      {/* Activity Selection */}
      <div className="card mb-6">
        <label className="block text-sm font-medium mb-2">Pilih Kegiatan</label>
        <select
          value={selectedActivity}
          onChange={(e) => {
            setSelectedActivity(e.target.value)
            setQrData('')
            setQrImage('')
          }}
          className="input mb-4"
        >
          <option value="">-- Pilih Kegiatan --</option>
          {availableActivities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.title} - {new Date(activity.date).toLocaleDateString('id-ID')}
            </option>
          ))}
        </select>

        {selectedActivity && canManage && (
          <button
            onClick={handleGenerateQR}
            className="btn btn-primary w-full"
          >
            Generate QR Code Absensi
          </button>
        )}
      </div>

      {/* QR Code Display */}
      {qrImage && activity && (
        <div className="card mb-6 text-center">
          <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {new Date(activity.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <img src={qrImage} alt="QR Code" className="w-64 h-64 mx-auto" />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Scan QR code ini untuk melakukan absensi
          </p>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                const link = document.createElement('a')
                link.download = `qr-${activity.title.replace(/\s+/g, '-')}.png`
                link.href = qrImage
                link.click()
              }}
              className="btn btn-secondary"
            >
              💾 Download QR
            </button>
            <button
              onClick={() => {
                setQrData('')
                setQrImage('')
              }}
              className="btn btn-secondary"
            >
              ✖️ Tutup
            </button>
          </div>
        </div>
      )}

      {/* Attendance Stats */}
      {selectedActivity && stats && (
        <div className="card mb-6">
          <h3 className="font-bold mb-4">Statistik Kehadiran</h3>
          <div className="grid grid-cols-3 gap-4">
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
        </div>
      )}

      {/* Attendance List */}
      {selectedActivity && stats && stats.attendees.length > 0 && (
        <div className="card">
          <h3 className="font-bold mb-4">Daftar Kehadiran</h3>
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
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
                    ✓ Hadir
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {availableActivities.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada kegiatan yang tersedia untuk absensi
          </p>
        </div>
      )}
    </div>
  )
}

export default Attendance
