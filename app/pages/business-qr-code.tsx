import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { BrowserQRCodeSvgWriter } from '@zxing/browser'
import { auth } from '../firebase'

export default function BusinessQRCode () {
  const router = useRouter()
  const qrCodeWriter = new BrowserQRCodeSvgWriter()
  const svg = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const businessUid = auth.currentUser!.uid
    if (svg.current) {
      svg.current.appendChild(qrCodeWriter.write(businessUid, 256, 256))
    }
  }, [])

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Your Unique Business QR Code
        </h1>
        <div className="place-self-center white-div">
          <div className="w-[256px] h-[256px] bg-left" ref={svg}/>
        </div>

        <div className="home-buttondiv">

          <button onClick={() => router.push('/business-home')} className="general-button">
            Go back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
