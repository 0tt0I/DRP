import { useRouter } from 'next/router'
import React from 'react'
import HomeButton from '../components/HomeButton'

export default function RedeemReward () {
  const router = useRouter()

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
            Redeem Your Rewards
        </h1>
        <HomeButton router={router} where="/" />
      </div>
    </div>
  )
}
