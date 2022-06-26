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

          <HomeButton router={router} where="/business/home" />

          <p>Go back to the main business management page.</p>
        </div>
      </div>
    </div>
  )
}
