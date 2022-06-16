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
          What would you like to do?
        </h1>

        <div className="home-buttondiv">
          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <button onClick={() => router.push('/referrals')} className="general-button">
            Redeem Referrals
          </button>
          <button onClick={() => router.push('/add-referral')} className="general-button">
            New Referral
          </button>
          <button onClick={() => router.push('/my-referrals')} className="general-button">
            My Referrals
          </button>
        </div>
      </div>
    </div>
  )
}
