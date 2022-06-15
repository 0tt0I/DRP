import React, { useEffect, useState } from 'react'
import { BrowserCodeReader, BrowserQRCodeReader } from '@zxing/browser'
import { auth } from '../firebase'
import { checkNewCustomer } from '../services/businessQrScan'

export default function QRScanner () {
  // QR code reader.
  const reader = new BrowserQRCodeReader()

  // Result box.
  const [data, setData] = useState('no result')
  const [decodeResult, setDecodeResult] = useState('')

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
        setData('Invalid QR-code')
        break
      case 0:
        setData('This customer has had a discount before...')
        break
      case 1:
        setData('This is a new customer! Treat them to a discount')
        break
      case 2:
        setData('This referral is for a different business.')
        break
      default:
        break
      }
    }
    updateData()
  }, [decodeResult])

  return (
    <div>
      <video id='scanner-preview' width='512' height='512' />
      <br />
      {decodeResult}
      <br />
      {data}
    </div>
  )
}
