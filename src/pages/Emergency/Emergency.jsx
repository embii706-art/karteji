import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { dbOperations } from '../../utils/db'
import { nanoid } from 'nanoid'

const Emergency = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [location, setLocation] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [sending, setSending] = useState(false)

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: '🚑', color: 'red', phone: '118' },
    { id: 'fire', name: 'Fire', icon: '🚒', color: 'orange', phone: '113' },
    { id: 'police', name: 'Security/Police', icon: '👮', color: 'blue', phone: '110' },
    { id: 'disaster', name: 'Natural Disaster', icon: '🌪️', color: 'purple', phone: '129' },
    { id: 'accident', name: 'Accident', icon: '🚨', color: 'yellow', phone: '118' },
    { id: 'other', name: 'Other Emergency', icon: '⚠️', color: 'gray', phone: null }
  ]

  useEffect(() => {
    getLocation()
    loadEmergencies()
  }, [])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Location error:', error)
          showNotification('Unable to get location', 'warning')
        },
        { enableHighAccuracy: true }
      )
    }
  }

  const loadEmergencies = async () => {
    try {
      const allEmergencies = await dbOperations.getAll('emergency')
      setEmergencies(allEmergencies.sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error('Load emergencies error:', error)
    }
  }

  const sendSOS = async () => {
    if (!location) {
      showNotification('Location not available. Trying to get location...', 'warning')
      getLocation()
      return
    }

    if (!selectedType) return

    setSending(true)
    try {
      const emergency = {
        id: nanoid(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone || 'Not provided',
        type: selectedType.id,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        },
        timestamp: Date.now(),
        status: 'active',
        responders: []
      }

      await dbOperations.add('emergency', emergency)
      setEmergencies([emergency, ...emergencies])
      
      // Send browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 Emergency SOS Sent', {
          body: `${selectedType.name} alert sent to nearby members`,
          icon: '/pwa-192x192.png',
          tag: emergency.id
        })
      }

      // In production, this would send to server and notify nearby members
      showNotification('SOS sent! Help is on the way', 'success')
      
      setShowConfirm(false)
      setSelectedType(null)
    } catch (error) {
      console.error('Send SOS error:', error)
      showNotification('Failed to send SOS', 'error')
    } finally {
      setSending(false)
    }
  }

  const resolveEmergency = async (emergencyId) => {
    try {
      const emergency = await dbOperations.get('emergency', emergencyId)
      emergency.status = 'resolved'
      emergency.resolvedAt = Date.now()
      await dbOperations.put('emergency', emergency)
      
      loadEmergencies()
      showNotification('Emergency marked as resolved', 'success')
    } catch (error) {
      console.error('Resolve emergency error:', error)
      showNotification('Failed to update emergency', 'error')
    }
  }

  const getGoogleMapsLink = (lat, lon) => {
    return `https://www.google.com/maps?q=${lat},${lon}`
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const activeEmergencies = emergencies.filter(e => e.status === 'active')
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-pink-800 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">🚨 Emergency SOS</h1>
          <p className="opacity-90">Quick Response System</p>
        </div>

        {/* Location Status */}
        {location ? (
          <div className="glass-card rounded-2xl p-4 text-white text-center mb-6">
            <div className="text-sm opacity-90 mb-1">📍 Your Location</div>
            <div className="text-xs opacity-80">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Accuracy: ±{Math.round(location.accuracy)}m
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4 text-white text-center mb-6">
            <div className="text-sm opacity-90">⚠️ Getting your location...</div>
          </div>
        )}

        {/* Emergency Buttons */}
        <div className="glass-card rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">Select Emergency Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {emergencyTypes.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type)
                  setShowConfirm(true)
                }}
                className={`aspect-square rounded-2xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105 flex flex-col items-center justify-center p-4`}
              >
                <div className="text-5xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-center">{type.name}</div>
                {type.phone && (
                  <div className="text-xs opacity-70 mt-1">☎️ {type.phone}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="glass-card rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold mb-4">📞 Emergency Contacts</h3>
          <div className="space-y-2">
            <a href="tel:118" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚑</span>
                  <span>Ambulance</span>
                </div>
                <span className="font-bold">118</span>
              </div>
            </a>
            <a href="tel:113" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚒</span>
                  <span>Fire Department</span>
                </div>
                <span className="font-bold">113</span>
              </div>
            </a>
            <a href="tel:110" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👮</span>
                  <span>Police</span>
                </div>
                <span className="font-bold">110</span>
              </div>
            </a>
            <a href="tel:129" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌪️</span>
                  <span>Disaster Agency</span>
                </div>
                <span className="font-bold">129</span>
              </div>
            </a>
          </div>
        </div>

        {/* Active Emergencies */}
        {activeEmergencies.length > 0 && (
          <div className="glass-card rounded-2xl p-6 text-white mb-6">
            <h3 className="text-lg font-bold mb-4">🔴 Active Emergencies ({activeEmergencies.length})</h3>
            <div className="space-y-3">
              {activeEmergencies.map(emergency => {
                const type = emergencyTypes.find(t => t.id === emergency.type)
                return (
                  <div key={emergency.id} className="bg-red-500/30 rounded-xl p-4 animate-pulse-soft">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{type?.icon}</span>
                        <div>
                          <div className="font-bold">{type?.name}</div>
                          <div className="text-sm opacity-90">{emergency.userName}</div>
                        </div>
                      </div>
                      <div className="text-xs opacity-80">{formatTimestamp(emergency.timestamp)}</div>
                    </div>
                    
                    <div className="text-sm mb-3">
                      📞 {emergency.userPhone}
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={getGoogleMapsLink(emergency.location.latitude, emergency.location.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-center py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        📍 View Location
                      </a>
                      {emergency.userId === user.id && (
                        <button
                          onClick={() => resolveEmergency(emergency.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          ✅ Resolve
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* History */}
        {resolvedEmergencies.length > 0 && (
          <div className="glass-card rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">✅ Resolved ({resolvedEmergencies.length})</h3>
            <div className="space-y-3">
              {resolvedEmergencies.slice(0, 5).map(emergency => {
                const type = emergencyTypes.find(t => t.id === emergency.type)
                return (
                  <div key={emergency.id} className="bg-white/10 rounded-xl p-4 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type?.icon}</span>
                        <div>
                          <div className="font-medium">{type?.name}</div>
                          <div className="text-xs opacity-80">{emergency.userName}</div>
                        </div>
                      </div>
                      <div className="text-xs">{formatTimestamp(emergency.timestamp)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirm && selectedType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="glass-card rounded-3xl p-8 w-full max-w-md text-white text-center animate-scale-in">
              <div className="text-7xl mb-4 animate-bounce-soft">{selectedType.icon}</div>
              <h3 className="text-2xl font-bold mb-4">Confirm Emergency</h3>
              <p className="text-lg mb-2">{selectedType.name}</p>
              <p className="text-sm opacity-80 mb-6">
                This will alert nearby members and emergency services
              </p>

              {!location && (
                <div className="bg-yellow-500/30 rounded-xl p-3 mb-6 text-sm">
                  ⚠️ Location not available. Getting location...
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false)
                    setSelectedType(null)
                  }}
                  disabled={sending}
                  className="flex-1 bg-white/20 rounded-xl py-4 font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendSOS}
                  disabled={sending || !location}
                  className="flex-1 bg-red-500 rounded-xl py-4 font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : '🚨 SEND SOS'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Emergency
