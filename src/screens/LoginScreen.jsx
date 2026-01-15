import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle } from 'lucide-react'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Masukkan email Anda')
      return
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Find user by email
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('../lib/firebase')
      
      const usersRef = collection(db, 'users')
      const emailQuery = query(usersRef, where('email', '==', email.trim().toLowerCase()))
      const querySnapshot = await getDocs(emailQuery)
      
      if (querySnapshot.empty) {
        setError('Email tidak terdaftar. Silakan daftar terlebih dahulu.')
        return
      }
      
      const userDoc = querySnapshot.docs[0]
      const userId = userDoc.id
      
      await login(userId)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary via-blue-700 to-primary-light min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent opacity-10 rounded-full blur-3xl"></div>
      
      {/* Logo Circle */}
      <div className="mb-8 relative animate-fadeIn">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white ring-opacity-30 overflow-hidden p-2">
          <img 
            src="/logo.jpg" 
            alt="KARTEJI Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
            <span className="text-5xl font-extrabold text-primary">K</span>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-base font-bold text-primary shadow-lg ring-2 ring-white">
          5
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-5xl font-extrabold text-white text-center mb-2 tracking-tight">KARTEJI</h1>
      <p className="text-xl text-blue-100 text-center mb-2 font-semibold">Karang Taruna RT 01</p>

      {/* Slogan */}
      <p className="text-center text-blue-200 text-base font-medium mb-8 max-w-xs">
        Pemuda Aktif, RT Produktif ✨
      </p>

      {/* Login Form */}
      <div className="w-full max-w-xs animate-slideUp">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-4">
          <form onSubmit={handleLogin}>
            <label className="block text-white text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:border-accent transition"
              disabled={loading}
            />
            
            {error && (
              <div className="mt-3 bg-red-100 bg-opacity-90 border border-red-300 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-accent text-primary font-bold py-4 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center mb-4">
          <p className="text-blue-200 text-sm mb-3">
            Belum punya akun?
          </p>
          <Link
            to="/register"
            className="block w-full bg-white bg-opacity-20 text-white font-bold py-4 rounded-xl border-2 border-white border-opacity-40 hover:bg-opacity-30 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            Daftar Anggota Baru
          </Link>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-blue-100 text-xs">
            Hubungi admin RT jika ada kendala akses
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-blue-100 text-sm mt-8 text-center font-medium">
        Membangun komunitas yang transparan dan produktif 🚀
      </p>
    </div>
  )
}
