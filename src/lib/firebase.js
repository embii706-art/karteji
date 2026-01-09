import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

// Prefer Vite env vars; fall back to provided snippet if not set
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAQxpD7ea9gHWGiU3wYXr0XHyl-SNyFYNs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'katar-9cac3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'katar-9cac3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'katar-9cac3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1017734829960',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1017734829960:web:6b02b7176f08a23ce28c3d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-M4F9J10TTE'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Enable offline persistence where supported
try {
  enableIndexedDbPersistence(db)
    .catch(() => {
      // Ignore persistence errors silently to avoid breaking the app offline
    })
} catch {
  // ignore
}

// Analytics (guarded for SSR/build and support)
export let analytics = null
if (typeof window !== 'undefined') {
  analyticsSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app)
    }
  })
}
