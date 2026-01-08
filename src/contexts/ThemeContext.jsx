import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS, APP_CONFIG } from '../config/app'
import { getActiveTheme } from '../config/themes'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // User's manual theme preference (light/dark)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME)
    return saved || APP_CONFIG.theme.defaultMode
  })
  
  // Auto-applied special date theme
  const [dateTheme, setDateTheme] = useState(null)
  
  // Animation preferences
  const [reduceAnimations, setReduceAnimations] = useState(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  
  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Apply light/dark mode
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Save preference
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])
  
  // Check for special date themes
  useEffect(() => {
    if (!APP_CONFIG.theme.enableAutoThemes) return
    
    const checkDateTheme = () => {
      const activeTheme = getActiveTheme()
      setDateTheme(activeTheme)
    }
    
    checkDateTheme()
    
    // Check daily
    const interval = setInterval(checkDateTheme, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const root = document.documentElement
      if (e.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  // Set specific theme
  const setThemeMode = (mode) => {
    setTheme(mode)
  }
  
  // Toggle animations
  const toggleAnimations = () => {
    setReduceAnimations(prev => !prev)
  }
  
  const value = {
    theme,
    dateTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    reduceAnimations,
    toggleTheme,
    setThemeMode,
    toggleAnimations
  }
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
