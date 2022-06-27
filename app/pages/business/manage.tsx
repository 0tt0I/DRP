import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import Header from '../../components/Header'

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
        <Header where="/business/home" text="Manage discounts and rewards" />

        <div className="home-short-buttondiv">
          <button onClick={() => router.push('/business/manage-discounts')} className="general-button">
            Manage new <br /> customer discounts
          </button>

          <p>Manage discounts offered to customers gained through Mira.</p>

          <button onClick={() => router.push('/business/manage-rewards')} className="general-button">
            Manage promoter <br /> rewards
          </button>

          <p>Manage what successful promoters of your business can spend points on.</p>
        </div>
      </div>
    </div>
  )
}
