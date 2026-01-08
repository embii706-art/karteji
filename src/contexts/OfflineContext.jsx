import { createContext, useContext, useState, useEffect } from 'react'
import { isOnline, onNetworkChange } from '../utils/registerSW'
import { syncOfflineData, offlineQueueDB } from '../utils/db'

const OfflineContext = createContext()

export const OfflineProvider = ({ children }) => {
  const [online, setOnline] = useState(isOnline())
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [queuedActions, setQueuedActions] = useState(0)
  
  // Update online status
  useEffect(() => {
    const updateStatus = (status) => {
      setOnline(status)
      
      // If coming back online, sync queued data
      if (status && !syncInProgress) {
        syncData()
      }
    }
    
    onNetworkChange(updateStatus)
  }, [syncInProgress])
  
  // Check queued actions count
  useEffect(() => {
    const updateQueueCount = async () => {
      const queue = await offlineQueueDB.getAll()
      setQueuedActions(queue.length)
    }
    
    updateQueueCount()
    
    // Update count periodically
    const interval = setInterval(updateQueueCount, 10000) // Every 10 seconds
    return () => clearInterval(interval)
  }, [])
  
  // Sync offline data
  const syncData = async () => {
    if (!online || syncInProgress) return
    
    setSyncInProgress(true)
    
    try {
      const results = await syncOfflineData()
      console.log('Sync complete:', results)
      
      // Update queue count
      const queue = await offlineQueueDB.getAll()
      setQueuedActions(queue.length)
      
      return results
    } catch (error) {
      console.error('Sync error:', error)
      throw error
    } finally {
      setSyncInProgress(false)
    }
  }
  
  // Add action to offline queue
  const queueAction = async (action) => {
    try {
      await offlineQueueDB.add(action)
      setQueuedActions(prev => prev + 1)
    } catch (error) {
      console.error('Queue action error:', error)
      throw error
    }
  }
  
  const value = {
    online,
    syncInProgress,
    queuedActions,
    syncData,
    queueAction
  }
  
  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return context
}
