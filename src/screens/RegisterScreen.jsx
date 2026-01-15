import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nama lengkap wajib diisi')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email wajib diisi')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Format email tidak valid')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Nomor HP wajib diisi')
      return false
    }
    if (formData.phone.length < 10) {
      setError('Nomor HP minimal 10 digit')
      return false
    }
    if (!formData.address.trim()) {
      setError('Alamat wajib diisi')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      setError(null)

      // Check if email already exists
      const usersRef = collection(db, 'users')
      const emailQuery = query(usersRef, where('email', '==', formData.email))
      const emailSnapshot = await getDocs(emailQuery)
      
      if (!emailSnapshot.empty) {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.')
        return
      }

      // Generate user ID
      const timestamp = Date.now()
      const userId = `user-${timestamp}`

      // Create user document
      await setDoc(doc(db, 'users', userId), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        role: 'Anggota',
        activityPoints: 0,
        joinDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString(),
        isActive: true,
      })

      setSuccess(true)
      
      // Save userId and redirect after 2 seconds
      setTimeout(() => {
        localStorage.setItem('karteji_userId', userId)
        navigate('/dashboard')
      }, 2000)

    } catch (err) {
      console.error('Registration error:', err)
      setError('Gagal mendaftar. Silakan coba lagi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-blue-700 to-primary-light flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-text-light mb-4">
            Selamat datang di KARTEJI. Akun Anda telah berhasil dibuat.
          </p>
          <p className="text-sm text-text-light">
            Mengalihkan ke dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-700 to-primary-light flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-white hover:text-accent transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white ring-opacity-30 mx-auto mb-4 overflow-hidden p-2">
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
                <span className="text-4xl font-extrabold text-primary">K</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Daftar Anggota Baru</h1>
            <p className="text-blue-200">Bergabung dengan Karang Taruna RT 05</p>
          </div>

          {/* Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 animate-slideUp">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Nama Lengkap <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:border-accent transition"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:border-accent transition"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Nomor HP <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08123456789"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:border-accent transition"
                  disabled={loading}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Alamat <span className="text-accent">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Alamat lengkap di RT 05"
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:border-accent transition resize-none"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 bg-opacity-90 border border-red-300 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary font-bold py-4 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-blue-200 text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-accent font-semibold hover:underline">
                  Login di sini
                </Link>
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="text-center mt-6">
            <p className="text-blue-100 text-xs">
              Dengan mendaftar, Anda menyetujui ketentuan dan kebijakan KARTEJI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
