import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useOffline } from '../../contexts/OfflineContext'
import { validateAttendanceQR, markAttendance } from '../../utils/attendance'
import { hasPermission } from '../../config/roles'
import QrScanner from 'qr-scanner'

const AttendanceScan = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isOnline } = useOffline()
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [manualCode, setManualCode] = useState('')

  const canManage = hasPermission(user?.role, 'MANAGE_ATTENDANCE')

  useEffect(() => {
    if (!canManage) {
      navigate('/attendance')
      return
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
      }
    }
  }, [canManage, navigate])

  const startScanner = async () => {
    try {
      setError(null)
      setResult(null)
      setScanning(true)

      if (!videoRef.current) {
        throw new Error('Video element not found')
      }

      const scanner = new QrScanner(
        videoRef.current,
        result => handleScanSuccess(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true
        }
      )

      scannerRef.current = scanner
      await scanner.start()
    } catch (err) {
      setError('Gagal mengakses kamera: ' + err.message)
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    setScanning(false)
  }

  const handleScanSuccess = async (data) => {
    stopScanner()
    
    try {
      const validation = validateAttendanceQR(data)
      
      if (!validation.valid) {
        setError(validation.error)
        return
      }

      const attendance = await markAttendance(
        validation.activityId,
        user.memberId,
        user.name,
        isOnline
      )

      setResult({
        success: true,
        message: 'Absensi berhasil dicatat!',
        activityId: validation.activityId,
        timestamp: attendance.timestamp
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return

    handleScanSuccess(manualCode)
    setManualCode('')
  }

  if (!canManage) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Scan QR Absensi</h1>
      </div>

      {/* Network Status */}
      {!isOnline && (
        <div className="card mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">Mode Offline: Data akan disinkronkan saat online</span>
          </div>
        </div>
      )}

      {/* Scanner Area */}
      <div className="card mb-6">
        {!scanning && !result && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="font-bold text-lg mb-2">Scan QR Code</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Arahkan kamera ke QR code absensi
            </p>
            <button
              onClick={startScanner}
              className="btn btn-primary"
            >
              Mulai Scan
            </button>
          </div>
        )}

        {scanning && (
          <div>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-primary rounded-lg animate-pulse" />
              </div>
            </div>
            <button
              onClick={stopScanner}
              className="btn btn-secondary w-full"
            >
              Berhenti Scan
            </button>
          </div>
        )}

        {result && (
          <div className="text-center py-12">
            <div className={`text-6xl mb-4 ${result.success ? '' : 'opacity-50'}`}>
              {result.success ? '✅' : '❌'}
            </div>
            <h3 className="font-bold text-lg mb-2">
              {result.success ? 'Berhasil!' : 'Gagal'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {result.message}
            </p>
            {result.timestamp && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                {new Date(result.timestamp).toLocaleString('id-ID')}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="btn btn-primary flex-1"
              >
                Scan Lagi
              </button>
              <button
                onClick={() => navigate('/attendance')}
                className="btn btn-secondary flex-1"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setResult(null)
              }}
              className="btn btn-primary"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Manual Input */}
      <div className="card">
        <h3 className="font-bold mb-4">Input Manual</h3>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Masukkan kode QR manual"
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Gunakan input manual jika kamera tidak berfungsi
        </p>
      </div>
    </div>
  )
}

export default AttendanceScan
