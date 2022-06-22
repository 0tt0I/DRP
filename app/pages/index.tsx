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
          <button onClick={() => router.push('/customer/referrals')} className="general-button">
            Discover
          </button>

          <p>Find a referral you like and discover a new place.</p>

          <button onClick={() => router.push('/customer/promoter-home')} className="general-button">
            Spread the Word
          </button>

          <p>Create your own referrals to earn loyalty points and then redeem those points.</p>

          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>
        </div>
      </div>
    </div>
  )
}
