import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import HomeButton from '../../components/HomeButton'
import QRUid from '../../components/QRUid'
import { getUid } from '../../services/authInfo'

export default function BusinessQRCode () {
  const router = useRouter()
  const uid = useRef(getUid())

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Your Unique Business QR Code
        </h1>
        <QRUid uid={uid.current}/>

        <HomeButton router={router} where="/business/business-home" />
      </div>
    </div>
  )
}
