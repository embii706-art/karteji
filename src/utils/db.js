import { openDB } from 'idb'
import { DB_CONFIG } from '../config/app'

let dbInstance = null

// Initialize IndexedDB
export const initDB = async () => {
  if (dbInstance) return dbInstance
  
  dbInstance = await openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db) {
      // Members store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.members)) {
        const memberStore = db.createObjectStore(DB_CONFIG.stores.members, {
          keyPath: 'id'
        })
        memberStore.createIndex('role', 'role')
        memberStore.createIndex('status', 'status')
      }
      
      // Activities store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.activities)) {
        const activityStore = db.createObjectStore(DB_CONFIG.stores.activities, {
          keyPath: 'id'
        })
        activityStore.createIndex('date', 'date')
        activityStore.createIndex('status', 'status')
      }
      
      // Attendance store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.attendance)) {
        const attendanceStore = db.createObjectStore(DB_CONFIG.stores.attendance, {
          keyPath: 'id'
        })
        attendanceStore.createIndex('activityId', 'activityId')
        attendanceStore.createIndex('memberId', 'memberId')
        attendanceStore.createIndex('synced', 'synced')
      }
      
      // Announcements store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.announcements)) {
        const announcementStore = db.createObjectStore(DB_CONFIG.stores.announcements, {
          keyPath: 'id'
        })
        announcementStore.createIndex('date', 'date')
        announcementStore.createIndex('priority', 'priority')
      }
      
      // Finance store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.finance)) {
        const financeStore = db.createObjectStore(DB_CONFIG.stores.finance, {
          keyPath: 'id'
        })
        financeStore.createIndex('date', 'date')
        financeStore.createIndex('type', 'type')
      }
      
      // Aspirations store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.aspirations)) {
        const aspirationStore = db.createObjectStore(DB_CONFIG.stores.aspirations, {
          keyPath: 'id'
        })
        aspirationStore.createIndex('status', 'status')
        aspirationStore.createIndex('votes', 'votes')
      }
      
      // Offline queue store
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.offlineQueue)) {
        const queueStore = db.createObjectStore(DB_CONFIG.stores.offlineQueue, {
          keyPath: 'id',
          autoIncrement: true
        })
        queueStore.createIndex('timestamp', 'timestamp')
        queueStore.createIndex('type', 'type')
      }
    }
  })
  
  return dbInstance
}

// Generic CRUD operations
export const dbOperations = {
  // Get all records from a store
  async getAll(storeName) {
    const db = await initDB()
    return db.getAll(storeName)
  },
  
  // Get a single record by ID
  async get(storeName, id) {
    const db = await initDB()
    return db.get(storeName, id)
  },
  
  // Get records by index
  async getByIndex(storeName, indexName, value) {
    const db = await initDB()
    return db.getAllFromIndex(storeName, indexName, value)
  },
  
  // Add a record
  async add(storeName, data) {
    const db = await initDB()
    return db.add(storeName, data)
  },
  
  // Update a record
  async put(storeName, data) {
    const db = await initDB()
    return db.put(storeName, data)
  },
  
  // Delete a record
  async delete(storeName, id) {
    const db = await initDB()
    return db.delete(storeName, id)
  },
  
  // Clear all records from a store
  async clear(storeName) {
    const db = await initDB()
    return db.clear(storeName)
  },
  
  // Count records
  async count(storeName) {
    const db = await initDB()
    return db.count(storeName)
  }
}

// Specific operations for members
export const memberDB = {
  async getAll() {
    return dbOperations.getAll(DB_CONFIG.stores.members)
  },
  
  async getById(id) {
    return dbOperations.get(DB_CONFIG.stores.members, id)
  },
  
  async getByRole(role) {
    return dbOperations.getByIndex(DB_CONFIG.stores.members, 'role', role)
  },
  
  async save(member) {
    return dbOperations.put(DB_CONFIG.stores.members, member)
  },
  
  async delete(id) {
    return dbOperations.delete(DB_CONFIG.stores.members, id)
  }
}

// Specific operations for attendance
export const attendanceDB = {
  async getAll() {
    return dbOperations.getAll(DB_CONFIG.stores.attendance)
  },
  
  async getByActivity(activityId) {
    return dbOperations.getByIndex(DB_CONFIG.stores.attendance, 'activityId', activityId)
  },
  
  async getByMember(memberId) {
    return dbOperations.getByIndex(DB_CONFIG.stores.attendance, 'memberId', memberId)
  },
  
  async getUnsynced() {
    return dbOperations.getByIndex(DB_CONFIG.stores.attendance, 'synced', false)
  },
  
  async save(attendance) {
    return dbOperations.put(DB_CONFIG.stores.attendance, {
      ...attendance,
      synced: attendance.synced || false,
      timestamp: attendance.timestamp || Date.now()
    })
  },
  
  async markAsSynced(id) {
    const attendance = await dbOperations.get(DB_CONFIG.stores.attendance, id)
    if (attendance) {
      attendance.synced = true
      return dbOperations.put(DB_CONFIG.stores.attendance, attendance)
    }
  }
}

// Offline queue operations
export const offlineQueueDB = {
  async getAll() {
    return dbOperations.getAll(DB_CONFIG.stores.offlineQueue)
  },
  
  async add(action) {
    return dbOperations.add(DB_CONFIG.stores.offlineQueue, {
      ...action,
      timestamp: Date.now()
    })
  },
  
  async delete(id) {
    return dbOperations.delete(DB_CONFIG.stores.offlineQueue, id)
  },
  
  async clear() {
    return dbOperations.clear(DB_CONFIG.stores.offlineQueue)
  }
}

// Sync offline data when connection is restored
export const syncOfflineData = async () => {
  const queue = await offlineQueueDB.getAll()
  const results = []
  
  for (const item of queue) {
    try {
      // Process the queued action
      // This would call the appropriate API endpoint
      console.log('Syncing:', item)
      
      // If successful, remove from queue
      await offlineQueueDB.delete(item.id)
      results.push({ success: true, item })
    } catch (error) {
      console.error('Sync failed:', error)
      results.push({ success: false, item, error })
    }
  }
  
  return results
}
