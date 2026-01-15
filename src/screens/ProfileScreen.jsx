import React, { useState, useEffect } from 'react'
import { Home, Calendar, MessageSquare, Wallet, User, Award, Heart, LogOut, Settings, AlertCircle } from 'lucide-react'
import { getUserProfile, getUserActivityPoints, getUserAttendance } from '../services/firestoreService'
import { getProfilePhotoUrl } from '../lib/cloudinary'

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [activityPoints, setActivityPoints] = useState(0)
  const [attendanceRecord, setAttendanceRecord] = useState([])

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userId = localStorage.getItem('karteji_userId') || 'user-001'

      // Load user profile from Firebase
      const profile = await getUserProfile(userId)
      if (!profile) throw new Error('Profile not found')
      setUserData(profile)

      // Load activity points from Firebase
      const points = await getUserActivityPoints(userId)
      setActivityPoints(points || 0)

      // Load attendance record from Firebase
      const attendance = await getUserAttendance(userId)
      setAttendanceRecord(attendance || [])
    } catch (err) {
      console.error('Error loading profile data:', err)
      setError(err.message)
      setUserData(null)
      setActivityPoints(0)
      setAttendanceRecord([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        <p className="text-text-light mt-4">Memuat profil...</p>
      </div>
    )
  }

  const profilePhotoUrl = userData?.photoUrl 
    ? getProfilePhotoUrl(userData.photoUrl)
    : null

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
          <h1 className="text-2xl font-bold">Profil Saya</h1>
        </div>
        <p className="text-blue-100 text-sm ml-11">Informasi akun pribadi</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="bg-yellow-50 border border-warning border-opacity-30 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-text-dark">Beberapa data tidak tersedia</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-border-light rounded-lg p-6 mb-6 shadow-sm text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt={userData?.name}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-4xl">
                👨
              </div>
            )}
          </div>

          {/* Name and Role */}
          <h2 className="text-xl font-bold text-text-dark mb-1">{userData?.name || 'Nama Pengguna'}</h2>
          <p className="text-sm text-text-light mb-2">{userData?.role || 'Anggota'}</p>
          <p className="text-xs text-text-light mb-4">Bergabung sejak {userData?.joinDate || 'Januari 2023'}</p>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded p-3 text-xs text-text-dark">
            <p className="mb-1"><strong>📱 {userData?.phone || '08123456789'}</strong></p>
            <p><strong>📧 {userData?.email || 'andi@example.com'}</strong></p>
          </div>
        </div>

        {/* Activity Points */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Prestasi & Poin</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-yellow-50 border border-accent border-opacity-30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-accent-dark mb-1">{activityPoints}</p>
            <p className="text-xs text-text-light">Poin Aktivitas</p>
          </div>
          <div className="bg-purple-50 border border-purple-300 border-opacity-30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">{attendanceRecord.length}</p>
            <p className="text-xs text-text-light">Kegiatan Dihadiri</p>
          </div>
        </div>

        {/* Badges */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Lencana Pencapaian</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-border-light rounded-lg p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs font-bold text-text-dark">Tim Terbaik</p>
            <p className="text-xs text-text-light">Desember 2024</p>
          </div>
          <div className="bg-white border border-border-light rounded-lg p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-xs font-bold text-text-dark">Peserta Aktif</p>
            <p className="text-xs text-text-light">Januari 2025</p>
          </div>
          <div className="bg-white border border-border-light rounded-lg p-4 text-center hover:shadow-md transition opacity-50">
            <div className="text-3xl mb-2 grayscale">🎯</div>
            <p className="text-xs font-bold text-text-dark">Pemimpin</p>
            <p className="text-xs text-text-light">Terkunci</p>
          </div>
        </div>

        {/* Participation History */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Riwayat Kehadiran</p>
        <div className="bg-white border border-border-light rounded-lg p-4 mb-6">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-bold text-text-light">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const isPresent = Math.random() > 0.3
              const isEmpty = i >= 28
              return (
                <div
                  key={i}
                  className={`aspect-square rounded text-xs flex items-center justify-center font-bold ${
                    isEmpty
                      ? 'bg-transparent'
                      : isPresent
                      ? 'bg-success text-white'
                      : 'bg-border-light text-text-light'
                  }`}
                >
                  {!isEmpty && i + 1}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-text-light mt-3">Kehadiran bulan ini: {attendanceRecord.length}/10 ({Math.round((attendanceRecord.length / 10) * 100)}%)</p>
        </div>

        {/* Menu Items */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Pengaturan</p>
        <div className="space-y-2 mb-6">
          <button className="w-full flex items-center gap-3 bg-white border border-border-light rounded-lg p-4 hover:bg-blue-50 transition">
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text-dark">Pengaturan Akun</span>
          </button>
          <button className="w-full flex items-center gap-3 bg-white border border-border-light rounded-lg p-4 hover:bg-blue-50 transition">
            <Heart className="w-5 h-5 text-danger" />
            <span className="text-sm font-medium text-text-dark">Preferensi Kegiatan</span>
          </button>
          <button className="w-full flex items-center gap-3 bg-white border border-border-light rounded-lg p-4 hover:bg-red-50 transition">
            <LogOut className="w-5 h-5 text-danger" />
            <span className="text-sm font-medium text-danger">Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light">
        <div className="flex justify-around items-center h-16 max-w-xs mx-auto">
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Beranda</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
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
          <button className="flex flex-col items-center justify-center flex-1 text-primary">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
