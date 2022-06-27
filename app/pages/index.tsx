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

        <div className="home-bus-buttondiv">
          <button onClick={() => router.push('/customer/discover')} className="general-button">
            Discover
          </button>

          <p>Find a referral you like and discover a new place.</p>

          <button onClick={() => router.push('/customer/spread-the-word')} className="general-button">
            Spread the Word
          </button>

          <p>Promote a local business and earn points by attracting new customers. </p>

          <button onClick={() => router.push('/customer/spend-points')} className="general-button">
            Spend points
          </button>

          <p>See the businesses you&apos;ve promoted and spend the points you&apos;ve earnt.</p>

          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <p>Log out of your account.</p>
        </div>
      </div>
    </div>
  )
}
