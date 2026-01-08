import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { useTheme } from '../../contexts/ThemeContext'
import { hasPermission } from '../../config/roles'
import FloatingNav from '../../components/FloatingNav/FloatingNav'

const Dashboard = () => {
  const { user } = useAuth()
  const { members, activities, announcements } = useApp()
  const { dateTheme } = useTheme()
  const [stats, setStats] = useState({
    totalMembers: 0,
    upcomingActivities: 0,
    recentAnnouncements: 0
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  
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
    
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [members, activities, announcements])
  
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }
  
  return (
    <div className="ios-dashboard ios-fade-in">
      {/* Cinematic Background */}
      <div className="ios-cinematic-bg">
        <div className="ios-gradient-mesh"></div>
      </div>
      
      {/* Welcome Header - Minimalist */}
      <div className="mb-8 ios-slide-up">
        <h1 className="ios-title-large mb-2">{getGreeting()}</h1>
        <p className="ios-headline" style={{ color: 'var(--ios-blue)' }}>
          {user?.name}
        </p>
        <p className="ios-caption mt-1">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      
      {/* Special Theme Banner - Glass Style */}
      {dateTheme && (
        <div className="ios-card-glass mb-6 ios-animate-in">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{dateTheme.icon || '🎉'}</span>
            <div>
              <h3 className="ios-headline">{dateTheme.name}</h3>
              <p className="ios-caption">Selamat merayakan!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Premium Features Grid - iOS Style */}
      <div className="mb-8">
        <h2 className="ios-headline mb-4">Fitur Premium</h2>
        <div className="ios-feature-grid">
          <Link 
            to="/weather" 
            className="ios-feature-card"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: 'white'
            }}
          >
            <div className="ios-feature-icon">🌤️</div>
            <p className="ios-feature-title">Weather</p>
          </Link>
          
          <Link 
            to="/religious" 
            className="ios-feature-card"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
              color: 'white'
            }}
          >
            <div className="ios-feature-icon">☪️</div>
            <p className="ios-feature-title">Religious</p>
          </Link>
          
          <Link 
            to="/waste-bank" 
            className="ios-feature-card"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
              color: 'white'
            }}
          >
            <div className="ios-feature-icon">♻️</div>
            <p className="ios-feature-title">Waste Bank</p>
          </Link>
          
          <Link 
            to="/calendar" 
            className="ios-feature-card"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: 'white'
            }}
          >
            <div className="ios-feature-icon">📅</div>
            <p className="ios-feature-title">Calendar</p>
          </Link>
          
          <Link 
            to="/marketplace" 
            className="ios-feature-card"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
              color: 'white'
            }}
          >
            <div className="ios-feature-icon">🛒</div>
            <p className="ios-feature-title">Market</p>
          </Link>
          
          <Link 
            to="/emergency" 
            className="ios-feature-card ios-pulse"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
            }}
          >
            <div className="ios-feature-icon">🚨</div>
            <p className="ios-feature-title">SOS</p>
          </Link>
        </div>
      </div>
      
      {/* Stats - Glass Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Link to="/members" className="ios-card-glass text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="ios-headline" style={{ color: 'var(--ios-blue)' }}>
            {stats.totalMembers}
          </div>
          <div className="ios-footnote">Anggota</div>
        </Link>
        
        <Link to="/activities" className="ios-card-glass text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="ios-headline" style={{ color: 'var(--ios-green)' }}>
            {stats.upcomingActivities}
          </div>
          <div className="ios-footnote">Kegiatan</div>
        </Link>
        
        <Link to="/announcements" className="ios-card-glass text-center">
          <div className="text-3xl mb-2">📢</div>
          <div className="ios-headline" style={{ color: 'var(--ios-orange)' }}>
            {stats.recentAnnouncements}
          </div>
          <div className="ios-footnote">Info</div>
        </Link>
      </div>
      
      {/* Quick Actions - Glass Pills */}
      <div className="ios-card-glass mb-8">
        <h3 className="ios-headline mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/member-card" className="ios-btn ios-btn-primary">
            🪪 Kartu Anggota
          </Link>
          <Link to="/activities" className="ios-btn ios-btn-glass">
            📅 Kegiatan
          </Link>
          {hasPermission(user?.role, 'VIEW_FINANCE') && (
            <Link to="/finance" className="ios-btn ios-btn-glass">
              💰 Keuangan
            </Link>
          )}
          <Link to="/aspirations" className="ios-btn ios-btn-glass">
            💡 Aspirasi
          </Link>
        </div>
      </div>
      
      {/* Recent Announcements - Minimalist */}
      {announcements.length > 0 && (
        <div className="ios-card-glass">
          <div className="flex justify-between items-center mb-4">
            <h3 className="ios-headline">Pengumuman</h3>
            <Link to="/announcements" className="ios-caption" style={{ color: 'var(--ios-blue)' }}>
              Lihat Semua →
            </Link>
          </div>
          
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement, index) => (
              <div
                key={announcement.id}
                className="ios-card p-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="ios-body font-semibold mb-1">{announcement.title}</h4>
                <p className="ios-caption line-clamp-2 mb-2">
                  {announcement.content}
                </p>
                <p className="ios-footnote">
                  {new Date(announcement.date).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Floating Navigation */}
      <FloatingNav />
    </div>
  )
}

export default Dashboard
