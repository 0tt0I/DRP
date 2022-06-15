import React, { useEffect, useState } from 'react'
import { BrowserCodeReader, BrowserQRCodeReader } from '@zxing/browser'
import { auth } from '../firebase'
import { checkNewCustomer } from '../services/businessQrScan'
import { useRouter } from 'next/router'

export default function QRScanner () {
  // Request router.
  const router = useRouter()

  // QR code reader.
  const reader = new BrowserQRCodeReader()

  // Result box.
  const [queryData, setQueryData] = useState('No Result')
  const [decodeResult, setDecodeResult] = useState('N/A')

  // Video devices.
  const [selectedDevice, setSelectedDevice] = useState('')

  // Initialise video devices.
  useEffect(() => {
    const getVideos = async () =>
      BrowserCodeReader.listVideoInputDevices()
        .then(
          devices => setSelectedDevice(devices[0].deviceId)
        )
        .catch(err =>
          console.info(err)
        )

    getVideos()
  }, [])

  // Now actually read.
  useEffect(() => {
    reader.decodeOnceFromVideoDevice(selectedDevice, 'scanner-preview')
      .then(result => setDecodeResult(result.getText()))
      .catch(console.info)
  }, [selectedDevice])

  // Run something...
  useEffect(() => {
    async function updateData () {
      const newCust = (await checkNewCustomer(
        decodeResult,
        (auth.currentUser) ? auth.currentUser!.uid : '')).newUser

      switch (newCust) {
      case -1:
        setQueryData('Invalid QR-code')
        break
      case 0:
        setQueryData('This customer has had a discount before...')
        break
      case 1:
        setQueryData('This is a new customer! Treat them to a discount')
        break
      case 2:
        setQueryData('This referral is for a different business.')
        break
      default:
        break
      }
    }
    updateData()
  }, [decodeResult])

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Scan a Customer QR Code</h1>

        <video id='scanner-preview' width='512' height='512' className="rounded-lg" />

        <div className="grid grid-rows-2 grid-flow-col gap-2 min-w-fit">
          <p className="font-bold text-violet-900">RAW DECODED DATA</p>
          <p className="font-bold text-violet-900 w-32">REMARK</p>
          <p>{decodeResult}</p>
          <p className="w-72">{queryData}</p>
        </div>
      </div>

      <button onClick={() => router.push('/business-home')} className="general-button">
        Back To Home
      </button>
    </div>
  )
}
