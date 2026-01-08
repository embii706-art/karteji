import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { generateMemberQR } from '../../utils/attendance'
import { ROLE_NAMES } from '../../config/roles'
import { Avatar } from '../../components/Avatar'
import logo from '../../assets/logo.svg'

const MemberCard = () => {
  const { user } = useAuth()
  const [qrCode, setQrCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qr = await generateMemberQR(user.id, {
          name: user.name,
          role: user.role
        })
        setQrCode(qr)
      } catch (error) {
        console.error('QR generation error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user) {
      generateQR()
    }
  }, [user])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Kartu Anggota Digital</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kartu ini dapat digunakan untuk absensi kegiatan
        </p>
      </div>
      
      {/* Digital Member Card */}
      <div className="relative">
        {/* Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-white/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Karteji Logo" className="w-12 h-12" />
              <div className="text-white">
                <div className="font-bold text-lg">KARTEJI</div>
                <div className="text-xs opacity-90">Karang Taruna Digital</div>
              </div>
            </div>
          </div>
          
          {/* Photo and Info */}
          <div className="p-6 text-white">
            <div className="flex gap-4 mb-4">
              {/* Photo */}
              <Avatar src={user.photo} name={user.name} size="xl" />
              
              {/* Info */}
              <div className="flex-1">
                <div className="font-bold text-xl mb-1">{user.name}</div>
                <div className="text-sm opacity-90 mb-2">{ROLE_NAMES[user.role]}</div>
                <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-xs inline-block">
                  {user.memberId}
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></div>
              <span className="text-sm">Status: Aktif</span>
            </div>
            
            {/* QR Code */}
            <div className="bg-white rounded-lg p-4 flex flex-col items-center">
              {qrCode && (
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              )}
              <p className="text-xs text-gray-600 mt-2 text-center">
                Scan QR code ini untuk absensi kegiatan
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 text-center text-white text-xs">
            Berlaku sejak {new Date(user.joinedAt).toLocaleDateString('id-ID')}
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_infinite]"></div>
      </div>
      
      {/* Info */}
      <div className="mt-6 card">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <span>ℹ️</span> Cara Penggunaan
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400">1.</span>
            <span>Kartu ini dapat diakses secara offline</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400">2.</span>
            <span>QR Code berisi identitas unik Anda</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400">3.</span>
            <span>Tunjukkan kartu saat absensi kegiatan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400">4.</span>
            <span>Scan QR Code dengan aplikasi scanner</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MemberCard
