import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import HomeButton from '../../components/HomeButton'

export default function YourBusiness () {
  // states for logged in from useAuth hook
  const { loading } = useAuth()
  const router = useRouter()

  // blocks if loading
  if (loading) {
    return null
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
          Your Business
        </h1>

        <div className="home-bus-buttondiv">
          <button onClick={() => router.push('/business/edit-discounts')} className="general-button">
            Edit Referral Discounts
          </button>

          <p>Edit the available discounts offered to new customers.</p>

          <button onClick={() => router.push('/business/edit-rewards')} className="general-button">
            Edit Loyalty Rewards
          </button>

          <p>Edit the rewards that customers can trade loyalty points for.</p>

          <button onClick={() => router.push('/business/business-qr-code')} className="general-button">
            Your QR code
          </button>

          <p>Fetch the unique location-identifying QR code for your businesss.</p>

          <HomeButton router={router} where="/business/business-home" />
        </div>
      </div>
    </div>
  )
}
