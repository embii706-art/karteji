import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getEvents, getAnnouncements, getUserAttendance } from '../services/firestoreService'

export default function DashboardScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [upcomingEvent, setUpcomingEvent] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    if (!user) return
    
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load upcoming events from Firebase
        const events = await getEvents(1)
        setUpcomingEvent(events[0] || null)

        // Load announcements from Firebase
        const anns = await getAnnouncements(2)
        setAnnouncements(anns)

        // Load attendance from Firebase
        const currentMonth = new Date().getMonth() + 1
        const att = await getUserAttendance(user.id, currentMonth)
        setAttendance({
          total: att.length,
          month: currentMonth,
        })
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        <p className="text-text-light mt-4">Memuat data...</p>
      </div>
    )
  }

  const greetingName = user?.name?.split(' ')[0] || 'User'
  const activityPoints = user?.activityPoints || 0
  const attendanceCount = attendance.total || 0

  return (
    <div className="bg-gradient-to-b from-blue-50 to-background min-h-screen flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-primary-light text-white px-4 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <img src="/logo.jpg" alt="KARTEJI" className="h-10 w-10 rounded-full object-cover ring-2 ring-white ring-opacity-30" />
          <h1 className="text-3xl font-extrabold">Halo, {greetingName}! 👋</h1>
        </div>
        <p className="text-blue-100 text-sm font-medium relative z-10 ml-13">Senin, 15 Januari 2025</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 -mt-4">
        {error && (
          <div className="bg-yellow-50 border border-warning border-opacity-30 rounded-xl p-3 mb-4 flex gap-2 shadow-sm">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-text-dark">{error}</p>
          </div>
        )}

        {/* Member Status Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-text-light text-xs font-semibold mb-1 uppercase tracking-wide">Kehadiran Bulan Ini</p>
            <p className="text-3xl font-extrabold text-primary">{attendanceCount}/10</p>
            <p className="text-xs text-success mt-1 font-medium">✓ Aktif mengikuti</p>
          </div>
          <div className="bg-gradient-to-br from-accent to-yellow-400 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-primary text-xs font-semibold mb-1 uppercase tracking-wide">Poin Aktivitas</p>
            <p className="text-3xl font-extrabold text-primary">{activityPoints}</p>
            <p className="text-xs text-primary mt-1 font-medium">⭐ Terus berkontribusi</p>
          </div>
        </div>

        {/* Quick Actions */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Akses Cepat</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-primary text-white rounded-lg p-4 flex flex-col items-center justify-center h-24 hover:bg-primary-light transition">
            <Calendar className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Kegiatan</span>
          </button>
          <button className="bg-primary text-white rounded-lg p-4 flex flex-col items-center justify-center h-24 hover:bg-primary-light transition">
            <Calendar className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Jadwal</span>
          </button>
          <button className="bg-accent text-primary rounded-lg p-4 flex flex-col items-center justify-center h-24 hover:bg-accent-dark transition">
            <Wallet className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Keuangan</span>
          </button>
          <button className="bg-success text-white rounded-lg p-4 flex flex-col items-center justify-center h-24 hover:opacity-90 transition">
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Musyawarah</span>
          </button>
        </div>

        {/* Upcoming Activity */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Kegiatan Mendatang</p>
        {upcomingEvent ? (
          <div className="bg-white border border-border-light rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-sm text-text-dark">{upcomingEvent.title || 'Event Mendatang'}</h3>
              <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded">Besok</span>
            </div>
            <p className="text-xs text-text-light mb-2">📅 {upcomingEvent.date || 'Tanggal'}</p>
            <p className="text-xs text-text-light mb-3">📍 {upcomingEvent.location || 'Lokasi'}</p>
            <p className="text-xs text-text-dark">{upcomingEvent.description || 'Deskripsi event'}</p>
            <button className="mt-3 w-full bg-primary text-white text-xs font-bold py-2 rounded hover:bg-primary-light transition">
              Lihat Detail
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-primary border-opacity-20 rounded-lg p-4 mb-6">
            <p className="text-sm text-text-light">Tidak ada kegiatan mendatang</p>
          </div>
        )}

        {/* Announcements */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Pengumuman Penting</p>
        {announcements.length > 0 ? (
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-blue-50 border-l-4 border-primary rounded p-3">
                <p className="text-xs font-bold text-primary mb-1">{announcement.title}</p>
                <p className="text-xs text-text-light">{announcement.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-primary border-opacity-20 rounded-lg p-4">
            <p className="text-sm text-text-light">Tidak ada pengumuman baru</p>
          </div>
        )}
      </div>

    </div>
  )
}
