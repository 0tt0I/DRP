import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAL653H2KXSc6a4pmERyXJ-9dNHxELjy3M",
  authDomain: "mira-drp-7c877.firebaseapp.com",
  projectId: "mira-drp-7c877",
  storageBucket: "mira-drp-7c877.appspot.com",
  messagingSenderId: "348382514122",
  appId: "1:348382514122:web:5feb84099d5aa33b811d33",
  measurementId: "G-0CVVGJBR78" 
}

// Initialize Firebase

// Singleton pattern for getting firebase instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { db, auth }
