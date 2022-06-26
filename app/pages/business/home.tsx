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

        <div className="home-buttondiv">
          <button onClick={() => router.push('/business/referral-scanner')} className="general-button">
            Scan a Customer&apos;s Code
          </button>

          <p>Grant a customer their &ldquo;Mira discount&rdquo; or allow them to redeem points.</p>

          <button onClick={() => router.push('/business/qr-code')} className="general-button">
            Your QR Code
          </button>

          <p>Allow a customer to leave a &ldquo;Mira review&rdquo; and offer an exclusive discount to other new customers. </p>

          <button onClick={() => router.push('/business/manage')} className="general-button">
            Manage discounts <br />and rewards
          </button>

          <p>Edit the discounts and rewards you are offering. </p>

          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>
        </div>
      </div>
    </div>
  )
}
