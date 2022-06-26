import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import QRUid from '../../components/QRUid'
import { getUid } from '../../services/authInfo'
import HomeButton from '../../components/HomeButton'

export default function BusinessQRCode () {
  const router = useRouter()
  const uid = useRef(getUid())

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Your Unique Business QR Code
        </h1>
        <p className='place-self-center'>Customers need to scan this to make a referral.</p>
        <QRUid uid={uid.current}/>

        <HomeButton router={router} where="/business/home" />
      </div>
    </div>
  )
}
