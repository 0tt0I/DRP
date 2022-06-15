import React from 'react'
import useAuth from '../hooks/useAuth'

export default function BusinessHome () {
  // states for logged in from useAuth hook
  const { logout, loading } = useAuth()

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
