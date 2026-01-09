import { createContext, useContext, useReducer, useEffect } from 'react'
import { STORAGE_KEYS } from '../config/app'
import { getUsersCount, createUser as fsCreateUser } from '../services/firestoreUsers'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        
        if (userData && token) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: JSON.parse(userData)
          })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
    
    checkAuth()
  }, [])
  
  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // TODO: Replace with actual API call
      // For now, simulate login
      const mockUser = {
        id: '1',
        email,
        name: 'User Demo',
        role: 'anggota',
        photo: null,
        memberId: 'KT-2026-001',
        status: 'active',
        joinedAt: Date.now()
      }
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser))
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token')
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: mockUser
      })
      
      return { success: true }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }
  
  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Determine first-user status from Firestore (source of truth)
      let isFirstUser = false
      try {
        const count = await getUsersCount()
        isFirstUser = count === 0
      } catch (e) {
        // Fallback to localStorage if Firestore check fails
        const allUsersKey = 'karteji_all_users'
        const allUsersData = localStorage.getItem(allUsersKey)
        const existingUsers = allUsersData ? JSON.parse(allUsersData) : []
        isFirstUser = existingUsers.length === 0
      }
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: isFirstUser ? 'super_admin' : 'anggota',
        photo: null,
        // memberId will be sequential locally; Firestore does not enforce sequence
        memberId: `KT-2026-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
        status: 'active',
        joinedAt: Date.now()
      }

      // Persist to Firestore (primary)
      try {
        await fsCreateUser({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          memberId: newUser.memberId,
          status: newUser.status,
          joinedAt: newUser.joinedAt
        })
      } catch (e) {
        console.warn('Failed to persist user to Firestore, proceeding with local storage fallback', e)
      }

      // Maintain local list for backward compatibility
      const allUsersKey = 'karteji_all_users'
      const allUsersData = localStorage.getItem(allUsersKey)
      const existingUsers = allUsersData ? JSON.parse(allUsersData) : []
      existingUsers.push({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        memberId: newUser.memberId
      })
      localStorage.setItem(allUsersKey, JSON.stringify(existingUsers))
      
      // Save current user to localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser))
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token')
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: newUser
      })
      
      return { success: true, isFirstUser }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }
  
  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    dispatch({ type: 'LOGOUT' })
  }
  
  // Update user profile
  const updateUser = (updates) => {
    const updatedUser = { ...state.user, ...updates }
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    dispatch({
      type: 'UPDATE_USER',
      payload: updates
    })
  }
  
  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
