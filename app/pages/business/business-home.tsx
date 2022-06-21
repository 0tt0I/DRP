import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useRouter } from 'next/router'

export default function BusinessHome () {
  // states for logged in from useAuth hook
  const { logout, loading } = useAuth()
  const router = useRouter()

  // blocks if loading
  if (loading) {
    return null
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
          Business Home
        </h1>

        <div className="home-bus-buttondiv">
          <button onClick={() => router.push('/business/business-referral-scanner')} className="general-button">
            Scan a Customer&apos;s Code
          </button>

          <p>Scan a customer&apos;s QR code to verify their discount.</p>

          <button onClick={() => router.push('/business/your-business')} className="general-button">
            Your Business
          </button>

          <p>Edit the discounts you are offering or check your unique QR code.</p>

          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>
        </div>
      </div>
    </div>
  )
}
