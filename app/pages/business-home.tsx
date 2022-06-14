import { useRouter } from 'next/router'
import React from 'react'
import useAuth from '../hooks/useAuth'

export default function BusinessHome () {
  // states for logged in from useAuth hook
  const { logout, loading, isBusiness } = useAuth()
  const router = useRouter()

  // blocks if loading
  if (loading) {
    return null
  }

  if (!isBusiness) {
    router.push('/')
  }

  return (
    <div>
      <h1>Hello Business!</h1>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
