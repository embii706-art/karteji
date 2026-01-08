import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { ROLE_NAMES, ROLES } from '../../config/roles'
import { resetDatabase, confirmReset, doubleConfirmReset } from '../../utils/resetDatabase'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [isResetting, setIsResetting] = useState(false)

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      logout()
    }
  }

  const handleResetDatabase = async () => {
    // First confirmation
    if (!confirmReset()) {
      return
    }
    
    // Double confirmation with typed input
    if (!doubleConfirmReset()) {
      alert('❌ Database reset cancelled. The confirmation text did not match.')
      return
    }
    
    setIsResetting(true)
    
    try {
      const result = await resetDatabase()
      
      if (result.success) {
        alert('✅ Database reset successful!\n\nThe app will now reload. You can register a new Super Admin account.')
        // Force reload to clear all state
        window.location.href = '/register'
      } else {
        alert(`❌ Database reset failed: ${result.error}`)
        setIsResetting(false)
      }
    } catch (error) {
      alert(`❌ Database reset error: ${error.message}`)
      setIsResetting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>

      {/* Account Info */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Informasi Akun</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Nama</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Role</span>
            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
              {ROLE_NAMES[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Tema Aplikasi</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="font-medium">Tema Terang</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tampilan cerah</div>
              </div>
            </div>
            <input
              type="radio"
              name="theme"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <div className="font-medium">Tema Gelap</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tampilan gelap</div>
              </div>
            </div>
            <input
              type="radio"
              name="theme"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💻</span>
              <div>
                <div className="font-medium">Otomatis</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Sesuai sistem</div>
              </div>
            </div>
            <input
              type="radio"
              name="theme"
              checked={theme === 'system'}
              onChange={() => setTheme('system')}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <div className="font-medium">Otomatis (Waktu)</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Gelap malam, terang siang</div>
              </div>
            </div>
            <input
              type="radio"
              name="theme"
              checked={theme === 'auto'}
              onChange={() => setTheme('auto')}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>

      {/* App Info */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Tentang Aplikasi</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Versi</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Tipe</span>
            <span className="font-medium">Progressive Web App</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-sm">
              ✅ Online
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-200 dark:border-red-900 mb-6">
        <h2 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400">⚠️ Zona Berbahaya</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="btn w-full bg-red-600 hover:bg-red-700 text-white"
          >
            🚪 Keluar dari Akun
          </button>
          
          {/* Super Admin Only - Reset Database */}
          {user?.role === ROLES.SUPER_ADMIN && (
            <>
              <div className="pt-3 border-t-2 border-red-300 dark:border-red-800">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-3">
                  <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">
                    🗑️ Reset Database (Super Admin Only)
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-2">
                    This will permanently delete ALL data:
                  </p>
                  <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 ml-4">
                    <li>• All user accounts and registrations</li>
                    <li>• All activities, events, and attendance records</li>
                    <li>• All financial transactions and records</li>
                    <li>• All announcements and aspirations</li>
                    <li>• All premium features data (Weather, Calendar, etc.)</li>
                    <li>• Emergency contacts and SOS history</li>
                    <li>• Waste bank, marketplace, and religious data</li>
                  </ul>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-3 font-semibold">
                    ⚠️ This action cannot be undone! The app will restart from scratch.
                  </p>
                </div>
                
                <button
                  onClick={handleResetDatabase}
                  disabled={isResetting}
                  className="btn w-full bg-red-700 hover:bg-red-800 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? '🔄 Resetting Database...' : '💥 Reset All Data & Start Fresh'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
