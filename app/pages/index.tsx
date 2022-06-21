import React from 'react'
import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'

export default function Home () {
  const { logout, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
          User Home
        </h1>

        <div className="home-buttondiv">
          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>

          <button onClick={() => router.push('/user/referrals')} className="general-button">
            Redeem Referrals
          </button>

          <p>Use someone&apos;s referral for a discount.</p>

          <button onClick={() => router.push('/user/add-referral')} className="general-button">
            New Referral
          </button>

          <p>Create a new referral for a location.</p>

          <button onClick={() => router.push('/user/my-referrals')} className="general-button">
            My Referrals
          </button>

          <p>See your created referrals and their next discount progress.</p>

          <button onClick={() => router.push('/user/redeem-reward')} className="general-button">
            Redeem Rewards
          </button>

          <p>Redeem your available discounts for a location.</p>
        </div>
      </div>
    </div>
  )
}
