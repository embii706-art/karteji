import React, { useState, useEffect } from 'react'
import { Home, Calendar, MessageSquare, Wallet, User, MapPin, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { getEvents, registerEventAttendance } from '../services/firestoreService'

export default function EventsScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [registering, setRegistering] = useState({})

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const eventsData = await getEvents(10)
      setEvents(eventsData || [])
    } catch (err) {
      console.error('Error loading events:', err)
      setError(err.message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId) => {
    try {
      setRegistering({ ...registering, [eventId]: true })
      const userId = localStorage.getItem('karteji_userId') || 'user-001'
      await registerEventAttendance(eventId, userId)
      alert('Kehadiran berhasil didaftarkan!')
      loadEvents()
    } catch (err) {
      alert('Gagal mendaftar: ' + err.message)
    } finally {
      setRegistering({ ...registering, [eventId]: false })
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        <p className="text-text-light mt-4">Memuat kegiatan...</p>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pb-20">
      {/* Status Bar */}
      <div className="bg-primary text-white px-4 py-2 text-xs flex justify-between">
        <span>09:41</span>
        <span>●●●●●●●●●●</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-primary-light text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <img src="/logo.jpg" alt="KARTEJI" className="h-8 w-8 rounded-full object-cover ring-2 ring-white ring-opacity-30" />
          <h1 className="text-2xl font-bold">Kegiatan</h1>
        </div>
        <p className="text-blue-100 text-sm ml-11">Kegiatan aktif bulan ini</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="bg-yellow-50 border border-warning border-opacity-30 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-text-dark">Data dari Firebase tidak tersedia, menampilkan contoh data</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">Semua</button>
          <button className="bg-border-light text-text-dark text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition">Bakti Sosial</button>
          <button className="bg-border-light text-text-dark text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition">Olahraga</button>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const categoryEmojis = {
                'Bakti Sosial': '🧹',
                'Olahraga': '⚽',
                'Rapat': '📋',
                'Pelatihan': '💻',
              }
              const emoji = categoryEmojis[event.category] || '📌'

              return (
                <div key={event.id} className="bg-white border border-border-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Event Image */}
                  <div className="bg-gradient-to-br from-blue-200 to-blue-300 h-32 w-full flex items-center justify-center text-4xl opacity-80">
                    {emoji}
                  </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm text-text-dark flex-1 pr-2">{event.title}</h3>
                      <span className="bg-success bg-opacity-20 text-success text-xs font-bold px-2 py-1 rounded whitespace-nowrap">Aktif</span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-text-light">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date || 'Tanggal tidak tersedia'}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-xs text-text-light">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-text-light">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location || 'Lokasi'}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-2 text-xs text-text-light">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} peserta</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={registering[event.id]}
                      className={`w-full text-xs font-bold py-2 rounded transition ${
                        registering[event.id]
                          ? 'bg-text-light text-white cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-light'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      {registering[event.id] ? 'Mendaftar...' : 'Daftarkan Kehadiran'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-blue-50 border border-primary border-opacity-20 rounded-lg p-4">
            <p className="text-sm text-text-light">Tidak ada kegiatan tersedia</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light">
        <div className="flex justify-around items-center h-16 max-w-xs mx-auto">
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Beranda</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-primary">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Kegiatan</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Diskusi</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Keuangan</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
