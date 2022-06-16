import React from 'react'
import useAuth from '../hooks/useAuth'
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
          What would you like to do as a business?
        </h1>

        <div className="home-buttondiv">
          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <button onClick={() => router.push('/business-referral-scanner')} className="general-button">
            Scan Discount Code
          </button>

          <button onClick={() => router.push('/edit-discounts')} className="general-button">
            Edit Discounts
          </button>

          <button onClick={() => router.push('/business-qr-code')} className="general-button">
            Your QR Code
          </button>

          <button onClick={() => router.push('/business-point-checker')} className="general-button">
            Check Points
          </button>
        </div>
      </div>
    </div>
  )
}
