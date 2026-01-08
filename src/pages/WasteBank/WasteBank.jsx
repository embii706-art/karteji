import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { dbOperations } from '../../utils/db'
import { nanoid } from 'nanoid'
import QrScanner from 'qr-scanner'
import QRCode from 'qrcode'

const WasteBank = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [showDeposit, setShowDeposit] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [depositData, setDepositData] = useState({
    weight: '',
    type: 'plastic',
    points: 0
  })
  const [qrCode, setQrCode] = useState('')
  const [scanner, setScanner] = useState(null)

  const wasteTypes = [
    { id: 'plastic', name: 'Plastik', rate: 2000, icon: '🛢️', color: 'blue' },
    { id: 'paper', name: 'Kertas', rate: 1500, icon: '📄', color: 'yellow' },
    { id: 'metal', name: 'Logam', rate: 3000, icon: '🔩', color: 'gray' },
    { id: 'glass', name: 'Kaca', rate: 2500, icon: '🍾', color: 'green' },
    { id: 'organic', name: 'Organik', rate: 500, icon: '🌿', color: 'emerald' }
  ]

  useEffect(() => {
    loadBalance()
    loadTransactions()
    generateUserQR()
  }, [])

  useEffect(() => {
    const weight = parseFloat(depositData.weight) || 0
    const type = wasteTypes.find(t => t.id === depositData.type)
    const points = Math.round(weight * type.rate)
    setDepositData(prev => ({ ...prev, points }))
  }, [depositData.weight, depositData.type])

  const loadBalance = async () => {
    try {
      const userBalance = await dbOperations.get('waste_bank', `balance_${user.id}`)
      setBalance(userBalance?.balance || 0)
    } catch (error) {
      console.error('Load balance error:', error)
    }
  }

  const loadTransactions = async () => {
    try {
      const allTransactions = await dbOperations.getAll('waste_bank')
      const userTransactions = allTransactions.filter(t => 
        t.id.startsWith('tx_') && t.userId === user.id
      ).sort((a, b) => b.timestamp - a.timestamp)
      setTransactions(userTransactions)
    } catch (error) {
      console.error('Load transactions error:', error)
    }
  }

  const generateUserQR = async () => {
    try {
      const qrData = JSON.stringify({
        type: 'waste_bank',
        userId: user.id,
        name: user.name
      })
      const qr = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2
      })
      setQrCode(qr)
    } catch (error) {
      console.error('QR generation error:', error)
    }
  }

  const handleDeposit = async () => {
    if (!depositData.weight || depositData.weight <= 0) {
      showNotification('Please enter valid weight', 'error')
      return
    }

    try {
      const transaction = {
        id: `tx_${nanoid()}`,
        userId: user.id,
        type: depositData.type,
        weight: parseFloat(depositData.weight),
        points: depositData.points,
        timestamp: Date.now(),
        status: 'completed'
      }

      await dbOperations.add('waste_bank', transaction)

      const newBalance = balance + depositData.points
      await dbOperations.put('waste_bank', {
        id: `balance_${user.id}`,
        balance: newBalance
      })

      setBalance(newBalance)
      setDepositData({ weight: '', type: 'plastic', points: 0 })
      setShowDeposit(false)
      loadTransactions()
      showNotification(`Deposit successful! +Rp${depositData.points.toLocaleString('id-ID')}`, 'success')
    } catch (error) {
      console.error('Deposit error:', error)
      showNotification('Deposit failed', 'error')
    }
  }

  const startScanner = async () => {
    setShowScanner(true)
    const videoElement = document.getElementById('waste-scanner-video')
    if (videoElement) {
      const qrScanner = new QrScanner(
        videoElement,
        result => handleScanResult(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true
        }
      )
      await qrScanner.start()
      setScanner(qrScanner)
    }
  }

  const stopScanner = () => {
    if (scanner) {
      scanner.stop()
      scanner.destroy()
      setScanner(null)
    }
    setShowScanner(false)
  }

  const handleScanResult = (data) => {
    try {
      const parsed = JSON.parse(data)
      if (parsed.type === 'waste_bank') {
        showNotification(`Scanned: ${parsed.name}`, 'success')
        stopScanner()
      } else {
        showNotification('Invalid QR code', 'error')
      }
    } catch (error) {
      showNotification('Invalid QR code format', 'error')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getWasteType = (typeId) => {
    return wasteTypes.find(t => t.id === typeId) || wasteTypes[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">♻️ Bank Sampah Digital</h1>
          <p className="opacity-90">Tukar Sampah Jadi Uang</p>
        </div>

        {/* Balance Card */}
        <div className="glass-card rounded-3xl p-6 text-white text-center mb-6 animate-scale-in">
          <div className="text-sm opacity-80 mb-2">Saldo Anda</div>
          <div className="text-5xl font-bold mb-2">
            Rp{balance.toLocaleString('id-ID')}
          </div>
          <div className="text-sm opacity-80">
            {transactions.length} transaksi
          </div>
        </div>

        {/* User QR Code */}
        <div className="glass-card rounded-2xl p-6 text-white text-center mb-6">
          <h3 className="text-lg font-bold mb-4">QR Code Anda</h3>
          {qrCode && (
            <div className="bg-white p-4 rounded-xl inline-block">
              <img src={qrCode} alt="User QR" className="w-48 h-48" />
            </div>
          )}
          <p className="text-sm mt-4 opacity-80">
            Tunjukkan QR ini saat setor sampah
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowDeposit(true)}
            className="glass-card rounded-2xl p-6 text-white hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-2">📥</div>
            <div className="font-medium">Setor Sampah</div>
          </button>
          
          <button
            onClick={startScanner}
            className="glass-card rounded-2xl p-6 text-white hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-2">📸</div>
            <div className="font-medium">Scan QR</div>
          </button>
        </div>

        {/* Waste Types Info */}
        <div className="glass-card rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold mb-4">Harga Per Kg</h3>
          <div className="space-y-3">
            {wasteTypes.map(type => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span>{type.name}</span>
                </div>
                <span className="font-bold">Rp{type.rate.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-card rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Riwayat Transaksi</h3>
          {transactions.length === 0 ? (
            <p className="text-center opacity-80 py-8">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => {
                const type = getWasteType(tx.type)
                return (
                  <div key={tx.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm opacity-80">{tx.weight} kg</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-300">
                          +Rp{tx.points.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs opacity-80">
                          {formatDate(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Deposit Modal */}
        {showDeposit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="glass-card rounded-3xl p-6 w-full max-w-md text-white animate-scale-in">
              <h3 className="text-2xl font-bold mb-6">Setor Sampah</h3>
              
              <div className="space-y-4">
                {/* Waste Type */}
                <div>
                  <label className="block text-sm mb-2">Jenis Sampah</label>
                  <select
                    value={depositData.type}
                    onChange={(e) => setDepositData({ ...depositData, type: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white"
                  >
                    {wasteTypes.map(type => (
                      <option key={type.id} value={type.id} className="text-gray-900">
                        {type.icon} {type.name} - Rp{type.rate.toLocaleString('id-ID')}/kg
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm mb-2">Berat (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={depositData.weight}
                    onChange={(e) => setDepositData({ ...depositData, weight: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="0.0"
                  />
                </div>

                {/* Points Preview */}
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-sm opacity-80 mb-1">Poin yang didapat</div>
                  <div className="text-3xl font-bold text-green-300">
                    Rp{depositData.points.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeposit(false)}
                  className="flex-1 bg-white/20 rounded-xl py-3 font-medium hover:bg-white/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 bg-green-500 rounded-xl py-3 font-medium hover:bg-green-600 transition-colors"
                >
                  Setor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
            <div className="w-full max-w-md">
              <div className="text-center text-white mb-4">
                <h3 className="text-2xl font-bold mb-2">Scan QR Code</h3>
                <p className="opacity-80">Arahkan kamera ke QR code</p>
              </div>
              
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                <video
                  id="waste-scanner-video"
                  className="w-full h-full object-cover"
                ></video>
              </div>

              <button
                onClick={stopScanner}
                className="w-full glass-card rounded-xl py-3 text-white font-medium"
              >
                Tutup Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WasteBank
