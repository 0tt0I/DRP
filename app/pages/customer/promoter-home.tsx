import React from 'react'
import { useRouter } from 'next/router'
import useAuth from '../../hooks/useAuth'
import HomeButton from '../../components/HomeButton'

export default function Home () {
  const { loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
          Your Account
        </h1>

        <div className="home-buttondiv">
          <button onClick={() => router.push('/customer/add-referral')} className="general-button">
            New Referral
          </button>

          <p>Create a new referral to start collecting points.</p>

          <button onClick={() => router.push('/customer/redeem-reward')} className="general-button">
            My Locations
          </button>

          <p>See the businesses you&apos;ve referred and the loyalty points you&apos;ve earnt.</p>

          <HomeButton router={router} />
        </div>
      </div>
    </div>
  )
}
