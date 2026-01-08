import { useState, useEffect } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'

const Weather = () => {
  const { showNotification } = useNotifications()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        showNotification('Geolocation not supported', 'error')
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          fetchWeather(latitude, longitude)
        },
        (error) => {
          console.error('Location error:', error)
          // Use default location (Jakarta)
          setLocation({ latitude: -6.2088, longitude: 106.8456 })
          fetchWeather(-6.2088, 106.8456)
        }
      )
    }

    getLocation()
  }, [])

  const fetchWeather = async (lat, lon) => {
    try {
      // Using Open-Meteo API (free, no API key needed)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Jakarta`
      )
      const data = await response.json()
      
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feels_like: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        condition: getWeatherCondition(data.current.weather_code)
      })
      setLoading(false)
    } catch (error) {
      console.error('Weather fetch error:', error)
      showNotification('Failed to fetch weather data', 'error')
      setLoading(false)
    }
  }

  const getWeatherCondition = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return { name: 'Clear Sky', icon: '☀️', bg: 'from-blue-400 via-cyan-300 to-blue-200' }
    if (code <= 3) return { name: 'Partly Cloudy', icon: '⛅', bg: 'from-gray-400 via-gray-300 to-blue-200' }
    if (code <= 48) return { name: 'Foggy', icon: '🌫️', bg: 'from-gray-500 via-gray-400 to-gray-300' }
    if (code <= 67) return { name: 'Rainy', icon: '🌧️', bg: 'from-gray-600 via-gray-500 to-blue-400' }
    if (code <= 77) return { name: 'Snowy', icon: '❄️', bg: 'from-blue-200 via-white to-gray-200' }
    if (code <= 99) return { name: 'Thunderstorm', icon: '⛈️', bg: 'from-gray-800 via-gray-700 to-gray-600' }
    return { name: 'Unknown', icon: '🌡️', bg: 'from-gray-400 to-gray-300' }
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 w-16 h-16 border-4"></div>
          <p className="text-white text-lg">Loading weather...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Cinematic Weather Background */}
      <div className={`relative min-h-screen bg-gradient-to-br ${weather?.condition.bg} overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {weather?.condition.name === 'Clear Sky' && (
            <>
              <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
              <div className="absolute bottom-40 left-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </>
          )}
          {weather?.condition.name === 'Rainy' && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-white/40 animate-rain"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`
                  }}
                ></div>
              ))}
            </>
          )}
          {weather?.condition.name === 'Thunderstorm' && (
            <div className="absolute inset-0 animate-lightning"></div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Time and Date - Glass Card */}
            <div className="glass-card rounded-3xl p-6 mb-6 text-center text-white">
              <div className="text-6xl font-bold mb-2">{formatTime()}</div>
              <div className="text-lg opacity-90">{formatDate()}</div>
            </div>

            {/* Main Weather Display - 3D Card */}
            <div className="glass-card rounded-3xl p-8 mb-6 text-white perspective">
              <div className="text-center transform-3d">
                {/* Weather Icon */}
                <div className="text-9xl mb-4 animate-bounce-soft">
                  {weather?.condition.icon}
                </div>

                {/* Temperature */}
                <div className="text-7xl font-bold mb-2">
                  {weather?.temp}°C
                </div>

                {/* Condition */}
                <div className="text-2xl font-medium mb-4 opacity-90">
                  {weather?.condition.name}
                </div>

                {/* Feels Like */}
                <div className="text-lg opacity-80">
                  Terasa seperti {weather?.feels_like}°C
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="glass-card rounded-2xl p-6 text-white text-center">
                <div className="text-4xl mb-2">💧</div>
                <div className="text-3xl font-bold mb-1">{weather?.humidity}%</div>
                <div className="text-sm opacity-80">Kelembaban</div>
              </div>

              {/* Wind Speed */}
              <div className="glass-card rounded-2xl p-6 text-white text-center">
                <div className="text-4xl mb-2">💨</div>
                <div className="text-3xl font-bold mb-1">{weather?.wind_speed}</div>
                <div className="text-sm opacity-80">km/h</div>
              </div>
            </div>

            {/* Location Info */}
            {location && (
              <div className="glass-card rounded-2xl p-4 mt-6 text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-sm opacity-90">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => {
                setLoading(true)
                if (location) {
                  fetchWeather(location.latitude, location.longitude)
                }
              }}
              className="w-full mt-6 glass-card rounded-2xl p-4 text-white font-medium hover:scale-105 transition-transform"
            >
              🔄 Refresh Weather
            </button>
          </div>
        </div>
      </div>

      {/* Additional CSS for 3D effects */}
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          95% { opacity: 0.3; background: white; }
        }
        
        .animate-rain {
          animation: rain linear infinite;
        }
        
        .animate-lightning {
          animation: lightning 4s infinite;
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        .transform-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}

export default Weather
