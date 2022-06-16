import { useRouter } from 'next/router'
import React from 'react'
import HomeButton from '../components/HomeButton'

export default function SetDiscounts () {
  const router = useRouter()

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Set Discounts
        </h1>
        <button className="general-button">  Add </button>

        <HomeButton router={router} where="/business-home" />
      </div>
    </div>
  )
}
