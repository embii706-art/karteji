import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useOffline } from './OfflineContext'
import { dbOperations, DB_CONFIG } from '../utils/db'

const AppContext = createContext()

const initialState = {
  members: [],
  activities: [],
  announcements: [],
  finance: [],
  aspirations: [],
  loading: false,
  error: null
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_MEMBERS':
      return { ...state, members: action.payload, loading: false }
    
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] }
    
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        )
      }
    
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload)
      }
    
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload, loading: false }
    
    case 'ADD_ACTIVITY':
      return { ...state, activities: [...state.activities, action.payload] }
    
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        )
      }
    
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(a => a.id !== action.payload)
      }
    
    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload, loading: false }
    
    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.payload, ...state.announcements] }
    
    case 'SET_FINANCE':
      return { ...state, finance: action.payload, loading: false }
    
    case 'ADD_TRANSACTION':
      return { ...state, finance: [action.payload, ...state.finance] }
    
    case 'SET_ASPIRATIONS':
      return { ...state, aspirations: action.payload, loading: false }
    
    case 'ADD_ASPIRATION':
      return { ...state, aspirations: [action.payload, ...state.aspirations] }
    
    case 'UPDATE_ASPIRATION':
      return {
        ...state,
        aspirations: state.aspirations.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        )
      }
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { isAuthenticated } = useAuth()
  const { online, queueAction } = useOffline()
  
  // Load data from IndexedDB when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])
  
  // Load all data from IndexedDB
  const loadAllData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const [members, activities, announcements, finance, aspirations] = await Promise.all([
        dbOperations.getAll(DB_CONFIG.stores.members),
        dbOperations.getAll(DB_CONFIG.stores.activities),
        dbOperations.getAll(DB_CONFIG.stores.announcements),
        dbOperations.getAll(DB_CONFIG.stores.finance),
        dbOperations.getAll(DB_CONFIG.stores.aspirations)
      ])
      
      dispatch({ type: 'SET_MEMBERS', payload: members })
      dispatch({ type: 'SET_ACTIVITIES', payload: activities })
      dispatch({ type: 'SET_ANNOUNCEMENTS', payload: announcements })
      dispatch({ type: 'SET_FINANCE', payload: finance })
      dispatch({ type: 'SET_ASPIRATIONS', payload: aspirations })
    } catch (error) {
      console.error('Load data error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }
  
  // Generic save function (handles online/offline)
  const saveData = async (storeName, data, actionType) => {
    try {
      // Save to IndexedDB first
      await dbOperations.put(storeName, data)
      
      // Update state
      dispatch({ type: actionType, payload: data })
      
      // If online, sync to server
      if (online) {
        // TODO: API call to sync with server
        console.log('Syncing to server:', data)
      } else {
        // Queue for later sync
        await queueAction({
          type: 'save',
          storeName,
          data,
          timestamp: Date.now()
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Save error:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Member operations
  const addMember = (member) => saveData(DB_CONFIG.stores.members, member, 'ADD_MEMBER')
  const updateMember = (member) => saveData(DB_CONFIG.stores.members, member, 'UPDATE_MEMBER')
  
  // Activity operations
  const addActivity = (activity) => saveData(DB_CONFIG.stores.activities, activity, 'ADD_ACTIVITY')
  const updateActivity = (activity) => saveData(DB_CONFIG.stores.activities, activity, 'UPDATE_ACTIVITY')
  
  // Announcement operations
  const addAnnouncement = (announcement) => saveData(DB_CONFIG.stores.announcements, announcement, 'ADD_ANNOUNCEMENT')
  
  // Finance operations
  const addTransaction = (transaction) => saveData(DB_CONFIG.stores.finance, transaction, 'ADD_TRANSACTION')
  
  // Aspiration operations
  const addAspiration = (aspiration) => saveData(DB_CONFIG.stores.aspirations, aspiration, 'ADD_ASPIRATION')
  const updateAspiration = (aspiration) => saveData(DB_CONFIG.stores.aspirations, aspiration, 'UPDATE_ASPIRATION')
  
  const value = {
    ...state,
    addMember,
    updateMember,
    addActivity,
    updateActivity,
    addAnnouncement,
    addTransaction,
    addAspiration,
    updateAspiration,
    loadAllData
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
