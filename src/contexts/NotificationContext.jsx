import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || 'info', // success, error, warning, info
      title: notification.title,
      message: notification.message,
      duration: notification.duration || 5000,
      action: notification.action
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const success = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options })
  }, [addNotification])

  const error = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, duration: 7000, ...options })
  }, [addNotification])

  const warning = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }, [addNotification])

  const info = useCallback((title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options })
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

const Notification = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-900 dark:text-green-100'
      case 'error':
        return 'text-red-900 dark:text-red-100'
      case 'warning':
        return 'text-yellow-900 dark:text-yellow-100'
      case 'info':
      default:
        return 'text-blue-900 dark:text-blue-100'
    }
  }

  return (
    <div
      className={`${getBgColor()} ${getTextColor()} border rounded-lg shadow-lg p-4 animate-slide-in-right pointer-events-auto`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
          )}
          {notification.message && (
            <p className="text-sm opacity-90">{notification.message}</p>
          )}
          {notification.action && (
            <button
              onClick={() => {
                notification.action.onClick()
                onClose()
              }}
              className="text-sm font-medium underline mt-2 hover:opacity-80"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
