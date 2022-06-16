import { initializeApp, getApp, getApps } from 'firebase/app'
import { collection, CollectionReference, DocumentData, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { environmentConfig } from '../config/config'

const firebaseConfig = {
  apiKey: environmentConfig.apiKey,
  authDomain: environmentConfig.authDomain,
  projectId: environmentConfig.projectId,
  storageBucket: environmentConfig.storageBucket,
  messagingSenderId: environmentConfig.messagingSenderId,
  appId: environmentConfig.appId,
  measurementId: environmentConfig.measurementId
}

// Initialize Firebase

// Singleton pattern for getting firebase instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()
const storage = getStorage()

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}

export default app
export { db, auth, storage }
