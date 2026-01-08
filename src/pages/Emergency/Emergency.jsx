import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { dbOperations } from '../../utils/db'
import { nanoid } from 'nanoid'
import {
  SEMARANG_EMERGENCY,
  getAllEmergencyContacts,
  getNearestFacilities,
  getAdminsWithinRadius,
  generateTrackingLink,
  sendEmergencySMS
} from '../../utils/emergency'

const Emergency = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [location, setLocation] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [sending, setSending] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [longPressProgress, setLongPressProgress] = useState(0)
  const [showDirectory, setShowDirectory] = useState(false)
  const [nearestFacilities, setNearestFacilities] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [familyContacts, setFamilyContacts] = useState([])
  const progressInterval = useRef(null)

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: '🚑', color: 'red' },
    { id: 'fire', name: 'Fire', icon: '🚒', color: 'orange' },
    { id: 'police', name: 'Security/Police', icon: '👮', color: 'blue' },
    { id: 'disaster', name: 'Natural Disaster', icon: '🌪️', color: 'purple' },
    { id: 'accident', name: 'Accident', icon: '🚨', color: 'yellow' },
    { id: 'other', name: 'Other Emergency', icon: '⚠️', color: 'gray' }
  ]

  useEffect(() => {
    getLocation()
    loadEmergencies()
    loadEmergencyDirectory()
    loadFamilyContacts()
  }, [])

  useEffect(() => {
    if (location) {
      const nearest = getNearestFacilities(location.latitude, location.longitude)
      setNearestFacilities(nearest.slice(0, 3))
    }
  }, [location])

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
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      )
    }
  }

  const loadEmergencies = async () => {
    try {
      const allEmergencies = await dbOperations.getAll('emergency')
      setEmergencies(allEmergencies.filter(e => !e.isDirectory).sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error('Load emergencies error:', error)
    }
  }

  const loadEmergencyDirectory = () => {
    const contacts = getAllEmergencyContacts()
    setEmergencyContacts(contacts)
    
    // Store in IndexedDB for offline access
    contacts.forEach(async (contact) => {
      try {
        await dbOperations.put('emergency', {
          id: `directory_${contact.id}`,
          ...contact,
          isDirectory: true,
          timestamp: Date.now()
        })
      } catch (error) {
        console.error('Store directory error:', error)
      }
    })
  }

  const loadFamilyContacts = async () => {
    // Load from user settings or database
    // For now, use mock data
    const contacts = [
      { name: 'Family Member 1', phone: '081234567890' },
      { name: 'Family Member 2', phone: '081234567891' }
    ]
    setFamilyContacts(contacts)
  }

  // 3-second long press handler
  const handleSOSPress = (type) => {
    setSelectedType(type)
    setLongPressProgress(0)
    
    // Start progress animation
    progressInterval.current = setInterval(() => {
      setLongPressProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current)
          return 100
        }
        return prev + (100 / 30) // 30 frames in 3 seconds
      })
    }, 100)

    // Set 3-second timer
    const timer = setTimeout(() => {
      clearInterval(progressInterval.current)
      setLongPressProgress(100)
      triggerSOS(type)
    }, 3000)
    
    setLongPressTimer(timer)
  }

  const handleSOSRelease = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    setLongPressProgress(0)
    setSelectedType(null)
  }

  const triggerSOS = async (type) => {
    if (!location) {
      showNotification('Location not available. Please try again.', 'error')
      return
    }

    setSending(true)
    try {
      // Create emergency record
      const emergency = {
        id: nanoid(),
        userId: user.id,
        userName: user.name,
        userPhone: user.phone || 'Not provided',
        type: type.id,
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
      
      // Generate live tracking link
      const trackingLink = generateTrackingLink(
        location.latitude,
        location.longitude,
        user.name
      )

      // Get admins within 1km radius
      const nearbyAdmins = await getAdminsWithinRadius(
        location.latitude,
        location.longitude,
        1
      )

      // Send alerts to nearby admins
      if (nearbyAdmins.length > 0) {
        const alertMessage = `🚨 EMERGENCY ALERT!\n${user.name} needs help!\nType: ${type.name}\nLocation: ${trackingLink}\nTime: ${new Date().toLocaleString('id-ID')}`
        
        // In production, send to server to notify admins
        console.log('Alert sent to admins:', nearbyAdmins)
        showNotification(`Alert sent to ${nearbyAdmins.length} nearby admin(s)`, 'success')
      }

      // SMS backup to family if needed
      if (familyContacts.length > 0) {
        const smsMessage = `🚨 ${user.name} needs help! ${type.name}. Location: ${trackingLink}`
        const phoneNumbers = familyContacts.map(c => c.phone)
        
        try {
          await sendEmergencySMS(phoneNumbers, smsMessage)
          showNotification('SMS sent to family members', 'success')
        } catch (error) {
          console.error('SMS error:', error)
        }
      }

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 Emergency SOS Sent', {
          body: `${type.name} alert sent. Help is on the way!`,
          icon: '/pwa-192x192.png',
          tag: emergency.id,
          requireInteraction: true
        })
      }

      showNotification('🚨 SOS Sent! Help is on the way', 'success')
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

  const callNumber = (phone) => {
    window.location.href = `tel:${phone}`
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

  const formatDistance = (km) => {
    if (km < 1) return `${Math.round(km * 1000)}m`
    return `${km.toFixed(1)}km`
  }

  const activeEmergencies = emergencies.filter(e => e.status === 'active')
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-pink-800 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">🚨 Emergency SOS</h1>
          <p className="opacity-90">Comprehensive Emergency Response System</p>
        </div>

        {/* Location Status */}
        {location ? (
          <div className="glass-card rounded-2xl p-4 text-white text-center mb-6">
            <div className="text-sm opacity-90 mb-1">📍 Your Location (GPS Active)</div>
            <div className="text-xs opacity-80">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Accuracy: ±{Math.round(location.accuracy)}m
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4 text-white text-center mb-6 animate-pulse">
            <div className="text-sm opacity-90">⚠️ Getting your location...</div>
            <div className="text-xs opacity-70 mt-1">GPS required for SOS</div>
          </div>
        )}

        {/* Quick SOS Buttons - 3 second long press */}
        <div className="glass-card rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold mb-2 text-center">⚡ Quick SOS</h3>
          <p className="text-xs opacity-80 text-center mb-4">Hold for 3 seconds to send SOS</p>
          <div className="grid grid-cols-2 gap-3">
            {emergencyTypes.slice(0, 4).map(type => (
              <button
                key={type.id}
                onMouseDown={() => handleSOSPress(type)}
                onMouseUp={handleSOSRelease}
                onMouseLeave={handleSOSRelease}
                onTouchStart={() => handleSOSPress(type)}
                onTouchEnd={handleSOSRelease}
                disabled={!location}
                className={`relative aspect-square rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex flex-col items-center justify-center p-4 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
              >
                {/* Progress overlay */}
                {selectedType?.id === type.id && (
                  <div 
                    className="absolute inset-0 bg-white/30 transition-all"
                    style={{ 
                      height: `${longPressProgress}%`,
                      bottom: 0,
                      top: 'auto'
                    }}
                  ></div>
                )}
                
                <div className="relative z-10">
                  <div className="text-5xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-center">{type.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Nearest Facilities */}
        {nearestFacilities.length > 0 && (
          <div className="glass-card rounded-2xl p-6 text-white mb-6">
            <h3 className="text-lg font-bold mb-4">📍 Nearest Emergency Facilities</h3>
            <div className="space-y-3">
              {nearestFacilities.map(facility => (
                <div key={facility.id} className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{facility.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold">{facility.name}</div>
                        <div className="text-xs opacity-80">{facility.type}</div>
                        <div className="text-xs opacity-70 mt-1">
                          📏 {formatDistance(facility.distance)} away
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => callNumber(facility.emergency || facility.phone)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-center py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      📞 Call
                    </button>
                    <a
                      href={getGoogleMapsLink(facility.location.lat, facility.location.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-center py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      🗺️ Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Directory Button */}
        <button
          onClick={() => setShowDirectory(true)}
          className="w-full glass-card rounded-2xl p-4 text-white font-medium text-lg hover:scale-105 transition-transform mb-6"
        >
          📞 Semarang Emergency Directory
        </button>

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
                        📍 Live Location
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

        {/* Emergency Directory Modal */}
        {showDirectory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
            <div className="glass-card rounded-3xl p-6 w-full max-w-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit pb-4">
                <h3 className="text-2xl font-bold">📞 Emergency Directory</h3>
                <button
                  onClick={() => setShowDirectory(false)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>

              {/* General Emergency */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3">🚨 General Emergency</h4>
                <div className="space-y-2">
                  {SEMARANG_EMERGENCY.general.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => callNumber(contact.phone)}
                      className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{contact.icon}</span>
                          <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-xs opacity-80">{contact.description}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">{contact.phone}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3">🏥 Hospitals</h4>
                <div className="space-y-2">
                  {SEMARANG_EMERGENCY.hospitals.map(contact => (
                    <div key={contact.id} className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{contact.icon}</span>
                          <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-xs opacity-80">{contact.type}</div>
                            <div className="text-xs opacity-70 mt-1">{contact.address}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => callNumber(contact.emergency || contact.phone)}
                          className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          🚑 Emergency: {contact.emergency}
                        </button>
                        <button
                          onClick={() => callNumber(contact.phone)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          📞 {contact.phone}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Police */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3">👮 Police Stations</h4>
                <div className="space-y-2">
                  {SEMARANG_EMERGENCY.police.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => callNumber(contact.emergency || contact.phone)}
                      className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{contact.icon}</span>
                          <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-xs opacity-80">{contact.type}</div>
                          </div>
                        </div>
                        <div className="font-bold">{contact.emergency || contact.phone}</div>
                      </div>
                      <div className="text-xs opacity-70">{contact.address}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fire & Rescue */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3">🚒 Fire & Rescue</h4>
                <div className="space-y-2">
                  {SEMARANG_EMERGENCY.fireRescue.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => callNumber(contact.emergency || contact.phone)}
                      className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{contact.icon}</span>
                          <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-xs opacity-80">{contact.type}</div>
                          </div>
                        </div>
                        <div className="font-bold">{contact.emergency || contact.phone}</div>
                      </div>
                      <div className="text-xs opacity-70">{contact.address}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center text-xs opacity-70 mt-6">
                📴 This directory is available offline
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Emergency
