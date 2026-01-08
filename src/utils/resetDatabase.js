/**
 * Database Reset Utility
 * Wipes all application data and resets to initial state
 */

export const resetDatabase = async () => {
  try {
    // Clear all localStorage data
    const keysToRemove = [
      'karteji_user_data',
      'karteji_auth_token',
      'karteji_all_users',
      'karteji_theme',
      'karteji_members',
      'karteji_activities',
      'karteji_announcements',
      'karteji_finance',
      'karteji_aspirations',
      'hasSeenSplash'
    ]
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Clear IndexedDB
    const databases = ['karteji_db']
    
    for (const dbName of databases) {
      try {
        await new Promise((resolve, reject) => {
          const deleteRequest = indexedDB.deleteDatabase(dbName)
          deleteRequest.onsuccess = () => resolve()
          deleteRequest.onerror = () => reject(deleteRequest.error)
          deleteRequest.onblocked = () => {
            console.warn(`Database ${dbName} deletion blocked`)
            resolve() // Continue anyway
          }
        })
        console.log(`Database ${dbName} deleted successfully`)
      } catch (error) {
        console.error(`Error deleting database ${dbName}:`, error)
      }
    }
    
    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    console.log('✅ Database reset complete')
    return { success: true }
  } catch (error) {
    console.error('❌ Database reset error:', error)
    return { success: false, error: error.message }
  }
}

export const confirmReset = () => {
  return window.confirm(
    '⚠️ WARNING: This will permanently delete ALL data!\n\n' +
    'This action will:\n' +
    '• Delete all user accounts\n' +
    '• Remove all activities and events\n' +
    '• Clear all financial records\n' +
    '• Erase all announcements and aspirations\n' +
    '• Reset all premium features data\n' +
    '• Clear emergency contacts and history\n\n' +
    'The app will restart and you will need to register again.\n' +
    'The first person to register will become Super Admin.\n\n' +
    'Are you absolutely sure you want to continue?'
  )
}

export const doubleConfirmReset = () => {
  const confirmation = window.prompt(
    'Type "DELETE ALL DATA" (in capital letters) to confirm database reset:'
  )
  return confirmation === 'DELETE ALL DATA'
}
