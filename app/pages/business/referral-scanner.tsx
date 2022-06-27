import React, { useEffect, useRef, useState } from 'react'
import { getRewardInfo } from '../../services/rewardInfo'
import { getPointsEarned, updatePointsEarned } from '../../services/customerInfo'
import { awardPoints, checkNewCustomer } from '../../services/businessQrScan'
import QRScanner from '../../components/QRScanner'
import { Dialog } from '@headlessui/react'
import { getUid } from '../../services/authInfo'
import Header from '../../components/Header'

export default function BusinessReferralScanner () {
  // Result box.
  const [inputValidation, setInputValidation] = useState('No Result')
  const [decodeResult, setDecodeResult] = useState('')
  const [redeemOpen, setRedeemOpen] = useState(false)
  const [promoterUid, setPromoterUid] = useState('')
  const [redeemerUidState, setRedeemerUidState] = useState('')
  const [discount, setDiscount] = useState({
    description: '',
    points: 0,
    id: ''
  })
  const uid = useRef(getUid())

  const [currentPoints, setCurrentPoints] = useState(0)
  const [cost, setCost] = useState(0)
  const [description, setDescription] = useState('')
  const [customerUid, setCustomerUid] = useState('')

  // modal state for popup and info for claiming points
  const [claimOpen, setClaimOpen] = useState(false)

  // Run something...
  useEffect(() => {
    async function updateData () {
      if (decodeResult === '') {
        setInputValidation('No data.')
        return
      }

      const [qrType] = decodeResult.split('-', 1)
      // if this is a customer redeeming a referral
      if (qrType === 'referral') {
        redeemReferral()
      } else if (qrType === 'points') {
        redeemPoints()
      } else {
        setInputValidation('Invalid QR code')
      }
    }
    updateData()
  }, [decodeResult])

  async function redeemReferral () {
    // eslint-disable-next-line no-unused-vars
    const [_, businessUid, promoterUid, discountUid, redeemerUid] = decodeResult.split('-')

    // all uids non-empty
    // qrString valid
    const qrValid = businessUid && promoterUid && redeemerUid && discountUid
    if (!qrValid) {
      setInputValidation('Invalid QR-code')
      return
    }

    const jsonResponse = (await checkNewCustomer(
      businessUid,
      redeemerUid,
      discountUid,
      uid.current))

    if (!jsonResponse.businessValid) {
      setInputValidation('This referral is for a different business.')
      return
    }
    if (jsonResponse.newCustomer) {
      if (jsonResponse.discount) {
        setDiscount(jsonResponse.discount)
        setPromoterUid(promoterUid)
        setRedeemerUidState(redeemerUid)
        setInputValidation('This is a new customer! Treat them to a discount')
        setRedeemOpen(true)
      } else {
        setInputValidation('This is a new customer but their discount doesn\'t seem to be valid...')
      }
    } else {
      setInputValidation('This customer has had a discount before, to build loyalty points they need to make their own referral.')
    }
  }

  async function redeemPoints () {
    // get points from customer collection

    // eslint-disable-next-line no-unused-vars
    const [_, custUid, rewardUid] = decodeResult.split('-', 3)

    const businessUid = uid.current

    const custJson = await getPointsEarned(custUid, businessUid)
    const rewardJson = await getRewardInfo(businessUid, rewardUid)

    if (rewardJson.points === -1) {
      setInputValidation('Invalid reward')
    } else {
      if (custJson.pointsEarned === -1) {
        setInputValidation('Invalid customer')
      } else {
        if (custJson.pointsEarned < rewardJson.points) {
          const pts = ' (' + custJson.pointsEarned + '/' + rewardJson.points + ')'
          setInputValidation('Not enough points!' + pts)
        } else {
          setCurrentPoints(custJson.pointsEarned)
          setCost(rewardJson.points)
          setDescription(rewardJson.description)
          setCustomerUid(custUid)
          setClaimOpen(true)
        }
      }
    }
  }

  // remove points from user
  const removePoints = async () => {
    const businessUid = uid.current
    const newPoints = currentPoints - cost
    updatePointsEarned(customerUid, businessUid, newPoints)
  }

  function awaitAwardPoints (points: Number, promoterUid: string) {
    async function awaitService () {
      await awardPoints(points, promoterUid, uid.current, redeemerUidState)
    }

    awaitService()
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <Header where="/business/home" text="Scan a Customer QR Code" />

        <QRScanner resultSetter={setDecodeResult} showReset={true} />

        <h2 className="white-div font-bold text-nondark p-2 text-center">{inputValidation}</h2>

        <Dialog open={redeemOpen} onClose={() => setRedeemOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Claim Discount
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>This is a new customer using a referral.</p>
                  <p>Click To Reward: {discount.description}</p>
                </div>
              </Dialog.Description>

              <button className="general-button" onClick={() => {
                setRedeemOpen(false)
                setInputValidation('discount: "' + discount.description + '" awarded')
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

        <Dialog open={claimOpen} onClose={() => setClaimOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Claim Reward
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>This is a returning customer redeeming their loyalty points.</p>
                  <p>They have earnt {currentPoints} points and need {cost} to redeem!</p>
                  <p>Click To Reward: {description}</p>
                </div>
              </Dialog.Description>

              <button className="general-button" onClick={() => {
                setClaimOpen(false)
                removePoints()
              }}>
                Claim
              </button>

              <button className="general-button" onClick={() => setClaimOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  )
}
