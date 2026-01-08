import { useEffect, useState } from 'react'
import logo from '../../assets/logo.svg'

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Logo container with glassmorphism */}
      <div className="relative z-10 glass-card p-8 rounded-3xl animate-scale-in">
        <img
          src={logo}
          alt="Karteji Logo"
          className="w-32 h-32 animate-bounce-soft"
        />
      </div>

      {/* App name */}
      <h1 className="relative z-10 mt-8 text-4xl font-bold text-white animate-fade-in-up">
        Karteji
      </h1>
      
      {/* Tagline */}
      <p className="relative z-10 mt-2 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        Karang Taruna Digital
      </p>

      {/* Version */}
      <p className="relative z-10 mt-8 text-xs text-white/60 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        Version 1.5.0
      </p>

      {/* Loading indicator */}
      <div className="relative z-10 mt-4 flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}

export default SplashScreen
