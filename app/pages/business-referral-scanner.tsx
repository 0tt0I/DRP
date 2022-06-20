import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { awardPoints, checkNewCustomer } from '../services/businessQrScan'
import { useRouter } from 'next/router'
import QRScanner from '../components/QRScanner'
import HomeButton from '../components/HomeButton'
import { Dialog } from '@headlessui/react'

export default function BusinessReferralScanner () {
  // Request router.
  const router = useRouter()

  // Result box.
  const [queryData, setQueryData] = useState('No Result')
  const [decodeResult, setDecodeResult] = useState('')
  const [redeemOpen, setRedeemOpen] = useState(false)
  const [promoterUid, setPromoterUid] = useState('')
  const [redeemerUidState, setRedeemerUidState] = useState('')
  const [discount, setDiscount] = useState({
    description: '',
    points: 0,
    id: ''
  })

  // Run something...
  useEffect(() => {
    async function updateData () {
      if (decodeResult === '') {
        return
      }

      const [businessUid, promoterUid, discountUid, redeemerUid] = decodeResult.split('-')

      // all uids non-empty
      // qrString valid
      const qrValid = businessUid && promoterUid && redeemerUid && discountUid
      if (!qrValid) {
        setQueryData('Invalid QR-code')
        return
      }

      const jsonResponse = (await checkNewCustomer(
        businessUid,
        redeemerUid,
        discountUid,
        (auth.currentUser) ? auth.currentUser!.uid : ''))

      if (!jsonResponse.businessValid) {
        setQueryData('This referral is for a different business.')
        return
      }
      if (jsonResponse.newCustomer) {
        if (jsonResponse.discount) {
          setDiscount(jsonResponse.discount)
          setPromoterUid(promoterUid)
          setRedeemerUidState(redeemerUid)
          setQueryData('This is a new customer! Treat them to a discount')
          setRedeemOpen(true)
        } else {
          setQueryData('This is a new customer but their discount doesn\'t seem to be valid...')
        }
      } else {
        setQueryData('This customer has had a discount before...')
      }
    }
    updateData()
  }, [decodeResult])

  function awaitAwardPoints (points: Number, promoterUid: string) {
    async function awaitService () {
      await awardPoints(points, promoterUid, (auth.currentUser) ? auth.currentUser!.uid : '', redeemerUidState)
    }

    awaitService()
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Scan a Customer QR Code</h1>

        <QRScanner resultSetter={setDecodeResult} showReset={true} />

        <div className="grid grid-rows-2 grid-flow-col gap-2 min-w-fit">
          <p className="font-bold text-dark-nonblack w-32">Result</p>
          <p className="w-72">{queryData}</p>
        </div>

        <Dialog open={redeemOpen} onClose={() => setRedeemOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Claim Discount
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Click To Reward: {discount.description}:</p>
                </div>
              </Dialog.Description>

              <button className="general-button" onClick={() => {
                setRedeemOpen(false)
                setQueryData('discount: "' + discount.description + '" awarded')
                awaitAwardPoints(discount.points, promoterUid)
              }}>
                Reward
              </button>

              <button className="general-button" onClick={() => setRedeemOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <HomeButton router={router} where="/business-home" />
      </div>
    </div>
  )
}
