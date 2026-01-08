import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { useTheme } from '../../contexts/ThemeContext'
import { hasPermission } from '../../config/roles'

const Dashboard = () => {
  const { user } = useAuth()
  const { members, activities, announcements } = useApp()
  const { dateTheme } = useTheme()
  const [stats, setStats] = useState({
    totalMembers: 0,
    upcomingActivities: 0,
    recentAnnouncements: 0
  })
  
  useEffect(() => {
    // Calculate stats
    const now = new Date()
    const upcoming = activities.filter(a => new Date(a.date) > now)
    const recent = announcements.slice(0, 5)
    
    setStats({
      totalMembers: members.length,
      upcomingActivities: upcoming.length,
      recentAnnouncements: recent.length
    })
  }, [members, activities, announcements])
  
  return (
    <div className="animate-fade-in">
      {/* Special Theme Banner */}
      {dateTheme && (
        <div className="card mb-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h3 className="font-bold">{dateTheme.name}</h3>
              <p className="text-sm opacity-90">Selamat merayakan!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Selamat Datang, {user?.name}!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.role === 'super_admin' ? 'Super Admin' : 
               user?.role === 'ketua' ? 'Ketua' :
               user?.role === 'wakil_ketua' ? 'Wakil Ketua' :
               'Anggota'} - {user?.memberId}
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link to="/members" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.totalMembers}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Anggota
            </div>
          </div>
        </Link>
        
        <Link to="/activities" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.upcomingActivities}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Kegiatan
            </div>
          </div>
        </Link>
        
        <Link to="/announcements" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-3xl mb-2">📢</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.recentAnnouncements}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Pengumuman
            </div>
          </div>
        </Link>
      </div>
      
      {/* Quick Actions */}
      <div className="card mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <span>⚡</span> Aksi Cepat
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/member-card" className="btn btn-primary">
            🪪 Kartu Anggota
          </Link>
          <Link to="/activities" className="btn btn-secondary">
            📅 Kegiatan
          </Link>
          {hasPermission(user?.role, 'VIEW_FINANCE') && (
            <Link to="/finance" className="btn btn-secondary">
              💰 Keuangan
            </Link>
          )}
          <Link to="/aspirations" className="btn btn-secondary">
            💡 Aspirasi
          </Link>
        </div>
      </div>
      
      {/* Recent Announcements */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <span>📢</span> Pengumuman Terbaru
          </h3>
          <Link to="/announcements" className="text-sm text-primary-600 dark:text-primary-400">
            Lihat Semua →
          </Link>
        </div>
        
        {announcements.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
            Belum ada pengumuman
          </p>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <h4 className="font-medium mb-1">{announcement.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(announcement.date).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
