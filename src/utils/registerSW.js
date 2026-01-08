// Service Worker registration
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('SW registered:', registration)
        
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('Versi baru tersedia! Muat ulang untuk memperbarui?')) {
                window.location.reload()
              }
            }
          })
        })
      } catch (error) {
        console.error('SW registration failed:', error)
      }
    })
  }
}

// Check if app is running in standalone mode (installed as PWA)
export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

// Prompt user to install PWA
export const promptPWAInstall = () => {
  let deferredPrompt = null
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    
    // Show custom install prompt
    const installPrompt = document.createElement('div')
    installPrompt.className = 'install-prompt'
    installPrompt.innerHTML = `
      <div>
        <strong>Install Karteji</strong>
        <p class="text-sm mt-1">Akses lebih cepat dengan install aplikasi</p>
      </div>
      <div class="flex gap-2">
        <button id="install-btn" class="btn btn-sm bg-white text-primary-600 px-4">
          Install
        </button>
        <button id="cancel-btn" class="btn btn-sm bg-transparent border border-white">
          Nanti
        </button>
      </div>
    `
    document.body.appendChild(installPrompt)
    
    document.getElementById('install-btn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log('Install outcome:', outcome)
        deferredPrompt = null
      }
      installPrompt.remove()
    })
    
    document.getElementById('cancel-btn').addEventListener('click', () => {
      installPrompt.remove()
    })
  })
  
  // Handle successful installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully')
    deferredPrompt = null
  })
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported')
    return false
  }
  
  if (Notification.permission === 'granted') {
    return true
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  
  return false
}

// Send notification
export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      vibrate: [200, 100, 200],
      ...options
    })
    
    return notification
  }
}

// Check network status
export const isOnline = () => {
  return navigator.onLine
}

// Listen to network status changes
export const onNetworkChange = (callback) => {
  window.addEventListener('online', () => callback(true))
  window.addEventListener('offline', () => callback(false))
}

// Share API
export const shareContent = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.error('Share failed:', error)
      return false
    }
  }
  return false
}

// Check if device is low-end
export const isLowEndDevice = () => {
  // Check based on device memory (if available)
  if (navigator.deviceMemory) {
    return navigator.deviceMemory < 4 // Less than 4GB RAM
  }
  
  // Check based on hardware concurrency
  if (navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency < 4 // Less than 4 cores
  }
  
  // Default to false if we can't determine
  return false
}

// Get network information
export const getNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
      downlink: connection.downlink, // Mbps
      rtt: connection.rtt, // Round-trip time in ms
      saveData: connection.saveData // User has data saver enabled
    }
  }
  
  return null
}

// Optimize for low-end device or poor network
export const shouldOptimize = () => {
  const networkInfo = getNetworkInfo()
  const lowEnd = isLowEndDevice()
  
  return lowEnd || 
         (networkInfo && ['slow-2g', '2g'].includes(networkInfo.effectiveType)) ||
         (networkInfo && networkInfo.saveData)
}
