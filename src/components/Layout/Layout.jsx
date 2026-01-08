import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useOffline } from '../../contexts/OfflineContext'
import { useTheme } from '../../contexts/ThemeContext'

const Layout = () => {
  const { user, logout } = useAuth()
  const { online, queuedActions, syncData, syncInProgress } = useOffline()
  const { isDark, toggleTheme } = useTheme()
  
  const handleSync = async () => {
    try {
      await syncData()
      alert('Sinkronisasi berhasil!')
    } catch (error) {
      alert('Sinkronisasi gagal: ' + error.message)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Offline Banner */}
      {!online && (
        <div className="offline-banner">
          Mode Offline - Data akan disinkronkan saat terhubung
          {queuedActions > 0 && ` (${queuedActions} aksi tertunda)`}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/pwa-64x64.png" alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Karteji
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sync button */}
              {!online && queuedActions > 0 && (
                <button
                  onClick={handleSync}
                  disabled={syncInProgress}
                  className="btn btn-sm btn-primary"
                >
                  {syncInProgress ? 'Sync...' : `Sync (${queuedActions})`}
                </button>
              )}
              
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {isDark ? '🌞' : '🌙'}
              </button>
              
              {/* Logout */}
              <button
                onClick={logout}
                className="btn btn-sm btn-secondary"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      
      {/* Bottom Navigation - Active-Focused Pattern */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-semibold transition-all'
                : 'flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200'
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">🏠</span>
                {isActive && <span className="text-sm">Beranda</span>}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/member-card"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-semibold transition-all'
                : 'flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200'
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">🪪</span>
                {isActive && <span className="text-sm">Kartu</span>}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/activities"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-semibold transition-all'
                : 'flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200'
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">📅</span>
                {isActive && <span className="text-sm">Kegiatan</span>}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/members"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-semibold transition-all'
                : 'flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200'
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">👥</span>
                {isActive && <span className="text-sm">Anggota</span>}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full font-semibold transition-all'
                : 'flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200'
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">⚙️</span>
                {isActive && <span className="text-sm">Profil</span>}
              </>
            )}
          </NavLink>
        </div>
      </nav>
      
      {/* Add padding to prevent content from being hidden by bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}

export default Layout
