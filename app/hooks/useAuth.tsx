// import hooks from firebase auth
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth'
import { addDoc, doc, setDoc } from 'firebase/firestore'

// re-routing for next
import { useRouter } from 'next/router'

// react state hooks
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { auth, createCollection, db } from '../firebase'
import { Businesses } from '../types/FirestoreCollections'

// AuthContext type, promises signify the completion of an async function
interface IAuth {
  user: User | null
  signUp: (email: string, password: string, isBusiness: boolean) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

// default AuthContext
const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false
})

// interface for the props from the provider
interface ProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProviderProps) => {
  // states used throughout the hooks
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [error] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true) // used to block UI
  const router = useRouter()

  // hook to persist login state
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in, persist state
          setUser(user)
          setLoading(false)
        } else {
          // Not logged in, route to login page
          setUser(null)
          setLoading(true)
          router.push('/login')
        }

        setInitialLoading(false) // block UI
      }),
    [auth]
  )

  const signUp = async (email: string, password: string, isBusiness: boolean) => {
    setLoading(true) // user is signing up

    // create firebase entry, and push user to home screen using next router
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {

        setUser(userCredential.user)

        // create business document in relevant collection a re-route to right page
        if (isBusiness) {

          const collectionsRef = createCollection<Businesses>("businesses")
          await setDoc(doc(db, "businesses", auth.currentUser!.uid), {
            name: "todo!() name"
          });

          router.push("business-home")

        } else {
          router.push('/')
        }        
        
        setLoading(false)

      })
      .catch((error) => alert(error.message)) // catch errors
      .finally(() => setLoading(false)) // always set loading back to false
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true) // user is signing up

    // create firebase entry, and push user to home screen using next router
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
        router.push('/')
        setLoading(false)
      })
      .catch((error) => alert(error.message)) // catch errors
      .finally(() => setLoading(false)) // always set loading back to false
  }

  const logout = async () => {
    setLoading(true) // load

    signOut(auth).then(() => {
      setUser(null) // set user to null
    })
      .catch((error) => alert(error.message)) // catch errors
      .finally(() => setLoading(false)) // set loading to false
  }

  // memoized value for user's session, don't recompute if it's the same user
  const memoizedVal = useMemo(() => ({
    user, signUp, signIn, loading, logout, error
  }), [user, loading])

  // return AuthContext component
  return (
    <AuthContext.Provider value={memoizedVal}>
      {!initialLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth () {
  return useContext(AuthContext)
}
