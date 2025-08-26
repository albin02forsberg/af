// Server-side Firebase Admin SDK initialization
// Uses service account credentials from env. Do NOT expose these to the client.
import { applicationDefault, cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

function createAdminApp(): App {
  if (getApps().length) {
    return getApps()[0]!
  }

  // Prefer explicit service account if provided, else fall back to application default
  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  return initializeApp({
    credential: applicationDefault(),
    // If running locally with ADC, set projectId from env to avoid autodetect failures
    projectId: projectId,
  })
}

const adminApp = createAdminApp()
export const adminDb: Firestore = getFirestore(adminApp)
