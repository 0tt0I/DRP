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
          Business Home
        </h1>

        <div className="home-bus-buttondiv">
          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>

          <button onClick={() => router.push('/business-referral-scanner')} className="general-button">
            Scan Discount Code
          </button>

          <p>Scan and verify a discount code for your business.</p>

          <button onClick={() => router.push('/edit-discounts')} className="general-button">
            Edit Discounts
          </button>

          <p>Edit the available discount offers at your business.</p>

          <button onClick={() => router.push('/business-qr-code')} className="general-button">
            Your QR Code
          </button>

          <p>Fetch the unique location-identifying QR code for your businesss.</p>

          <button onClick={() => router.push('/business-point-checker')} className="general-button">
            Check Points
          </button>

          <p>Scan a customer&apos;s referral QR code to check their progress for another discount.</p>

          <button onClick={() => router.push('/business-reward-claim')} className="general-button">
            Reward
          </button>

          <p>Scan and use up a customer&apos;s returning discount code.</p>
        </div>
      </div>
    </div>
  )
}
