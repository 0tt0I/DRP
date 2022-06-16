import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BrowserQRCodeSvgWriter } from '@zxing/browser'
import { auth } from '../firebase'

export default function BusinessQRCode () {
  const router = useRouter()
  const qrCodeWriter = new BrowserQRCodeSvgWriter()
  const [qrImage, setQrImage] = useState<SVGSVGElement>()

  useEffect(() => {
    const businessUid = auth.currentUser!.uid
    setQrImage(qrCodeWriter.write(businessUid, 150, 150))
  }, [])

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Your Unique Business QR Code
        </h1>
        <div className="place-self-center">
          <svg
            className="w-[150px] h-[150px] bg-left"
            dangerouslySetInnerHTML={{ __html: qrImage ? qrImage.innerHTML : '' }}/>
        </div>

        <div className="home-buttondiv">

          <button onClick={() => router.push('/business-home')} className="general-button">
                Back
          </button>
        </div>
      </div>
    </div>
  )
}
