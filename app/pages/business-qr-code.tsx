import { useRouter } from 'next/router'
import React from 'react'
export default function BusinessQRCode () {
  const router = useRouter()

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Your Unique Business QR Code
        </h1>

        <div className="home-buttondiv">

          <button onClick={() => router.push('/business-home')} className="general-button">
                Back
          </button>
        </div>
      </div>
    </div>
  )
}
