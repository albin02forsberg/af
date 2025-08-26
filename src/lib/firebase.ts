// Firebase initialization for client-side Firestore usage in Next.js App Router
// Uses environment variables prefixed with NEXT_PUBLIC_ so they can be used on the client.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Guard against undefined required keys in dev to help debugging
function assertRequired(key: string, value: string | undefined) {
  if (!value && process.env.NODE_ENV !== 'production') {
    console.warn(`[firebase] Missing env var ${key}. Firestore may fail to initialize.`)
  }
}

assertRequired('NEXT_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey)
assertRequired('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain)
assertRequired('NEXT_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId)
assertRequired('NEXT_PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId)

let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

export const firebaseApp = app
export const db: Firestore = getFirestore(app)
