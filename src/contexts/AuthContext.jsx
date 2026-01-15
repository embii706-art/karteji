import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserProfile } from '../services/firestoreService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const userId = localStorage.getItem('karteji_userId')
      if (userId) {
        const profile = await getUserProfile(userId)
        if (profile) {
          setUser({ id: userId, ...profile })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userId) => {
    try {
      const profile = await getUserProfile(userId)
      if (!profile) {
        throw new Error('User not found')
      }
      localStorage.setItem('karteji_userId', userId)
      setUser({ id: userId, ...profile })
      return true
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('karteji_userId')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
