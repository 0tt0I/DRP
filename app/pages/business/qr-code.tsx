import React, { useRef } from 'react'
import Header from '../../components/Header'
import QRUid from '../../components/QRUid'
import { getUid } from '../../services/authInfo'

export default function BusinessQRCode () {
  const uid = useRef(getUid())

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <Header where='/business/home' text="Your Unique Business QR Code" />

        <p className='place-self-center'>Customers need to scan this to make a referral.</p>

        <QRUid uid={uid.current}/>
      </div>
    </div>
  )
}
