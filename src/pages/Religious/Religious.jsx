import { useState, useEffect } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'

const Religious = () => {
  const { showNotification } = useNotifications()
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [qiblaDirection, setQiblaDirection] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState(null)
  const [deviceHeading, setDeviceHeading] = useState(0)
  const [showQibla, setShowQibla] = useState(false)

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getLocationAndData()
  }, [])

  useEffect(() => {
    if (prayerTimes) {
      findNextPrayer()
    }
  }, [prayerTimes, currentTime])

  // Device orientation for Qibla
  useEffect(() => {
    if (showQibla && window.DeviceOrientationEvent) {
      const handleOrientation = (event) => {
        if (event.alpha !== null) {
          setDeviceHeading(event.alpha)
        }
      }

      window.addEventListener('deviceorientation', handleOrientation)
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [showQibla])

  const getLocationAndData = () => {
    if (!navigator.geolocation) {
      showNotification('Geolocation not supported', 'error')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        calculateQibla(latitude, longitude)
        fetchPrayerTimes(latitude, longitude)
      },
      (error) => {
        console.error('Location error:', error)
        // Default to Jakarta
        const lat = -6.2088
        const lon = 106.8456
        setLocation({ latitude: lat, longitude: lon })
        calculateQibla(lat, lon)
        fetchPrayerTimes(lat, lon)
      }
    )
  }

  const calculateQibla = (lat, lon) => {
    // Kaaba coordinates
    const kaabaLat = 21.4225
    const kaabaLon = 39.8262

    // Convert to radians
    const lat1 = lat * Math.PI / 180
    const lon1 = lon * Math.PI / 180
    const lat2 = kaabaLat * Math.PI / 180
    const lon2 = kaabaLon * Math.PI / 180

    // Calculate Qibla direction
    const dLon = lon2 - lon1
    const y = Math.sin(dLon)
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon)
    let bearing = Math.atan2(y, x) * 180 / Math.PI

    // Normalize to 0-360
    bearing = (bearing + 360) % 360

    setQiblaDirection(bearing)
  }

  const fetchPrayerTimes = async (lat, lon) => {
    try {
      const today = new Date()
      const month = today.getMonth() + 1
      const year = today.getFullYear()

      // Using Aladhan API
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=20`
      )
      const data = await response.json()

      const todayData = data.data[today.getDate() - 1]
      setPrayerTimes({
        fajr: todayData.timings.Fajr.split(' ')[0],
        dhuhr: todayData.timings.Dhuhr.split(' ')[0],
        asr: todayData.timings.Asr.split(' ')[0],
        maghrib: todayData.timings.Maghrib.split(' ')[0],
        isha: todayData.timings.Isha.split(' ')[0],
        sunrise: todayData.timings.Sunrise.split(' ')[0],
        date: todayData.date.hijri
      })
      setLoading(false)
    } catch (error) {
      console.error('Prayer times fetch error:', error)
      showNotification('Failed to fetch prayer times', 'error')
      setLoading(false)
    }
  }

  const findNextPrayer = () => {
    if (!prayerTimes) return

    const now = currentTime
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const prayers = [
      { name: 'Subuh', time: prayerTimes.fajr, icon: '🌅' },
      { name: 'Dzuhur', time: prayerTimes.dhuhr, icon: '☀️' },
      { name: 'Ashar', time: prayerTimes.asr, icon: '🌤️' },
      { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌅' },
      { name: 'Isya', time: prayerTimes.isha, icon: '🌙' }
    ]

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].time > timeString) {
        setNextPrayer(prayers[i])
        return
      }
    }

    // If no prayer found today, next is Fajr tomorrow
    setNextPrayer(prayers[0])
  }

  const getTimeUntilPrayer = () => {
    if (!nextPrayer) return ''

    const now = currentTime
    const [prayerHour, prayerMin] = nextPrayer.time.split(':').map(Number)
    
    let targetTime = new Date()
    targetTime.setHours(prayerHour, prayerMin, 0, 0)

    // If prayer time has passed today, set to tomorrow
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    const diff = targetTime - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}j ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-700">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 w-16 h-16 border-4 border-white"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">☪️ Islamic Hub</h1>
          <p className="opacity-90">Prayer Times & Qibla Direction</p>
        </div>

        {/* Hijri Date */}
        {prayerTimes?.date && (
          <div className="glass-card rounded-2xl p-4 text-white text-center mb-6">
            <div className="text-lg font-medium">
              {prayerTimes.date.day} {prayerTimes.date.month.en} {prayerTimes.date.year}
            </div>
          </div>
        )}

        {/* Next Prayer Countdown */}
        {nextPrayer && (
          <div className="glass-card rounded-3xl p-6 text-white text-center mb-6 animate-scale-in">
            <div className="text-6xl mb-3">{nextPrayer.icon}</div>
            <div className="text-2xl font-bold mb-2">Next: {nextPrayer.name}</div>
            <div className="text-4xl font-bold mb-2">{nextPrayer.time}</div>
            <div className="text-lg opacity-90">in {getTimeUntilPrayer()}</div>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {[
            { name: 'Subuh', time: prayerTimes?.fajr, icon: '🌅' },
            { name: 'Terbit', time: prayerTimes?.sunrise, icon: '🌄' },
            { name: 'Dzuhur', time: prayerTimes?.dhuhr, icon: '☀️' },
            { name: 'Ashar', time: prayerTimes?.asr, icon: '🌤️' },
            { name: 'Maghrib', time: prayerTimes?.maghrib, icon: '🌇' },
            { name: 'Isya', time: prayerTimes?.isha, icon: '🌙' }
          ].map((prayer, index) => (
            <div
              key={index}
              className={`glass-card rounded-xl p-4 text-white transition-all ${
                nextPrayer?.name === prayer.name ? 'ring-2 ring-white scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{prayer.icon}</span>
                  <span className="text-lg font-medium">{prayer.name}</span>
                </div>
                <div className="text-2xl font-bold">{prayer.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Qibla Compass Button */}
        <button
          onClick={() => setShowQibla(!showQibla)}
          className="w-full glass-card rounded-2xl p-4 text-white font-medium text-lg hover:scale-105 transition-transform mb-6"
        >
          🧭 {showQibla ? 'Hide' : 'Show'} Qibla Compass
        </button>

        {/* Qibla Compass */}
        {showQibla && qiblaDirection !== null && (
          <div className="glass-card rounded-3xl p-8 text-white text-center animate-scale-in">
            <h3 className="text-xl font-bold mb-6">Qibla Direction</h3>
            
            {/* Compass */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Compass Circle */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-white/30 flex items-center justify-center"
                style={{ transform: `rotate(${-deviceHeading}deg)`, transition: 'transform 0.3s ease' }}
              >
                {/* North indicator */}
                <div className="absolute top-2 text-sm font-bold">N</div>
                <div className="absolute bottom-2 text-sm">S</div>
                <div className="absolute left-2 text-sm">W</div>
                <div className="absolute right-2 text-sm">E</div>
              </div>
              
              {/* Qibla Arrow */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaDirection - deviceHeading}deg)`, transition: 'transform 0.3s ease' }}
              >
                <div className="text-6xl animate-bounce-soft">🕋</div>
              </div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="text-lg mb-2">Qibla Direction: <span className="font-bold">{Math.round(qiblaDirection)}°</span></div>
            <p className="text-sm opacity-80">Point your device north and face the Kaaba icon</p>
          </div>
        )}

        {/* Location Info */}
        {location && (
          <div className="glass-card rounded-2xl p-4 text-white text-center mt-6">
            <div className="text-sm opacity-90">
              📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Religious
