// App configuration
export const APP_CONFIG = {
  name: 'Karteji',
  fullName: 'Karang Taruna Digital',
  version: '1.0.0',
  description: 'Aplikasi digital untuk manajemen organisasi Karang Taruna',
  
  // Customize these for each organization
  organization: {
    name: 'Karang Taruna [Nama Kelurahan]', // To be customized
    address: '',
    province: '',
    city: '',
    subdistrict: '',
    village: '',
  },
  
  // Feature flags
  features: {
    memberCard: true,
    attendance: true,
    finance: true,
    aspirations: true,
    voting: true,
    announcements: true,
    chatGroups: false, // Future feature
  },
  
  // Performance settings
  performance: {
    imageMaxSizeMB: 0.5, // Max image size after compression
    imageMaxWidthOrHeight: 1024,
    cacheExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    offlineSyncInterval: 60000, // 1 minute
  },
  
  // Attendance settings
  attendance: {
    qrCodeExpiration: 300000, // 5 minutes in ms
    allowOfflineAttendance: true,
    preventDuplicateAttendance: true,
  },
  
  // Theme settings
  theme: {
    defaultMode: 'light', // 'light' | 'dark' | 'system'
    allowSystemMode: true,
    enableThemeAnimations: true,
    enableAutoThemes: true, // Auto themes for holidays, etc.
  },
}

// API endpoints (to be configured for production)
export const API_ENDPOINTS = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  members: '/members',
  activities: '/activities',
  attendance: '/attendance',
  announcements: '/announcements',
  finance: '/finance',
  aspirations: '/aspirations',
}

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'karteji_auth_token',
  USER_DATA: 'karteji_user_data',
  THEME: 'karteji_theme',
  OFFLINE_QUEUE: 'karteji_offline_queue',
  CACHED_DATA: 'karteji_cached_data',
  LAST_SYNC: 'karteji_last_sync',
  OPTIONAL_FEATURES: 'karteji_optional_features',
}

// IndexedDB configuration
export const DB_CONFIG = {
  name: 'KartejiDB',
  version: 1,
  stores: {
    members: 'members',
    activities: 'activities',
    attendance: 'attendance',
    announcements: 'announcements',
    finance: 'finance',
    aspirations: 'aspirations',
    offlineQueue: 'offline_queue',
  }
}

// Notification settings
export const NOTIFICATION_CONFIG = {
  enabled: true,
  types: {
    announcement: true,
    activity: true,
    finance: true,
    aspiration: true,
  }
}
