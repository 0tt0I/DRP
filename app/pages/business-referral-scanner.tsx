import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { checkNewCustomer } from '../services/businessQrScan'
import { useRouter } from 'next/router'
import QRScanner from '../components/QRScanner'
import HomeButton from '../components/HomeButton'

export default function BusinessReferralScanner () {
  // Request router.
  const router = useRouter()

  // Result box.
  const [queryData, setQueryData] = useState('No Result')
  const [decodeResult, setDecodeResult] = useState('')

  // Run something...
  useEffect(() => {
    async function updateData () {
      if (decodeResult === '') {
        return
      }

      const jsonResponse = (await checkNewCustomer(
        decodeResult,
        (auth.currentUser) ? auth.currentUser!.uid : ''))

      if (!jsonResponse.qrValid) {
        setQueryData('Invalid QR-code')
        return
      }
      if (!jsonResponse.businessValid) {
        setQueryData('This referral is for a different business.')
        return
      }
      if (jsonResponse.newCustomer) {
        setQueryData('This is a new customer! Treat them to a discount')
      } else {
        setQueryData('This customer has had a discount before...')
      }
    }
    updateData()
  }, [decodeResult])

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Scan a Customer QR Code</h1>

        <QRScanner resultSetter={setDecodeResult} showReset={true} />

        <div className="grid grid-rows-2 grid-flow-col gap-2 min-w-fit">
          <p className="font-bold text-dark-nonblack">RAW DECODED DATA</p>
          <p className="font-bold text-dark-nonblack w-32">REMARK</p>
          <p>{decodeResult}</p>
          <p className="w-48 sm:w-72">{queryData}</p>
        </div>

        <HomeButton router={router} where="/business-home" />
      </div>
    </div>
  )
}
