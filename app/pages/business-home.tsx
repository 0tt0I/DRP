import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'
import * as React from 'react'

export default function BusinessHome () {
  // states for logged in from useAuth hook
  const { logout, loading } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const router = useRouter()

  // blocks if loading
  if (loading) {
    return null
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
