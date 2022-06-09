//import hooks from firebase auth
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
  } from 'firebase/auth'
  
//re-routing for next
import { useRouter } from 'next/router'

//react state hooks
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { auth } from '../firebase'


//AuthContext type, promises signify the completion of an async function
interface IAuth {
    user: User | null
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
    loading: boolean
}

//default AuthContext
const AuthContext = createContext<IAuth> ({
    user: null,
    signUp: async () => {},
    signIn: async () => {},
    logout: async () => {},
    error: null,
    loading: false,
})

//interface for the props from the provider
interface ProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({children}: ProviderProps) => {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(null)
    const router = useRouter()

    const signUp = async (email: string, password: string) => {
        setLoading(true) //user is signing up

        //create firebase entry, and push user to home screen using next router
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/")
                setLoading(false)
            })
            .catch((error) => alert(error.message)) //catch errors
            .finally(() => setLoading(false)) //always set loading back to false
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true) //user is signing up

        //create firebase entry, and push user to home screen using next router
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user)
                router.push("/")
                setLoading(false)
            })
            .catch((error) => alert(error.message)) //catch errors
            .finally(() => setLoading(false)) //always set loading back to false
    }

    const logout = async() => {
        setLoading(true) //load

        signOut(auth).then(() => {
            setUser(null) //set user to null
        })
        .catch((error) => alert(error.message)) //catch errors
        .finally(() => setLoading(false)) //set loading to false
    }

    //memoized value for user's session, don't recompute if it's the same user
    const memoizedVal = useMemo(() => ({
        user, signUp, signIn, loading, logout, error
    }), [user, loading])

    // return AuthContext component
    return <AuthContext.Provider value={memoizedVal}> {children} </AuthContext.Provider>
}


export default function useAuth() {
    return useContext(AuthContext)
}