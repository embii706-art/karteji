import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  })
  const [error, setError] = useState('')
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    
    const result = await register(formData)
    
    if (result.success) {
      if (result.isFirstUser) {
        alert('🎉 Welcome! You are the first user and have been assigned as Super Admin with full administrative privileges.\n\nYou can manage user roles from the User Management section.')
      } else {
        alert('✅ Registration successful! You have been registered as a Member.\n\nThe Super Admin can assign you a different role if needed.')
      }
      navigate('/dashboard')
    } else {
      setError(result.error || 'Pendaftaran gagal')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 animate-fade-in">
          <img src="/pwa-192x192.png" alt="Logo" className="w-20 h-20 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white mb-1">Daftar Akun Baru</h1>
          <p className="text-primary-100 text-sm">Bergabung dengan Karang Taruna</p>
        </div>
        
        <div className="card animate-slide-up">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Nama lengkap Anda"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="nama@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                No. Telepon *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Alamat
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                placeholder="Alamat lengkap"
                rows="2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Konfirmasi Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Ketik ulang password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
