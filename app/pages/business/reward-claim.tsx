import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import QRScanner from '../../components/QRScanner'
import HomeButton from '../../components/HomeButton'
import { Dialog } from '@headlessui/react'
import { getPointsEarned, updatePointsEarned } from '../../services/customerInfo'
import { getDiscountInfo } from '../../services/discountInfo'
import { getUid } from '../../services/authInfo'

export default function BusinessRewardClaim () {
  // Request router.
  const router = useRouter()

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')
  const [encodedReward, setEncodedReward] = useState('')

  const [currentPoints, setCurrentPoints] = useState(0)
  const [cost, setCost] = useState(0)
  const [description, setDescription] = useState('')
  const [customerUid, setCustomerUid] = useState('')

  // modal state for popup and info for qr-scan
  const [qrOpen, setQrOpen] = useState(false)

  // modal state for popup and info for claim
  const [claimOpen, setClaimOpen] = useState(false)

  const uid = useRef(getUid())

  // Update on state changes to reward:
  useEffect(() => {
    const modify = async () => {
      if (encodedReward === '') {
        setInputValidation('No data.')
      } else {
        setInputValidation('Scanned successfully!')

        // get points from customer collection

        const [custUid, discountUid] = encodedReward.split('-', 2)

        const businessUid = uid.current

        const custJson = await getPointsEarned(custUid, businessUid)
        const discJson = await getDiscountInfo(businessUid, discountUid)

        if (discJson.points === -1) {
          setInputValidation('Invalid discount')
        } else {
          if (custJson.pointsEarned === -1) {
            setInputValidation('Invalid customer')
          } else {
            if (custJson.pointsEarned < discJson.points) {
              const pts = ' (' + custJson.pointsEarned + '/' + discJson.points + ')'
              setInputValidation('Not enough points!' + pts)
            } else {
              setCurrentPoints(custJson.pointsEarned)
              setCost(discJson.points)
              setDescription(discJson.description)
              setCustomerUid(custUid)
              setClaimOpen(true)
            }
          }
        }
      }
    }

    modify()
  }, [encodedReward])

  // remove points from user
  const removePoints = async () => {
    const businessUid = uid.current
    const newPoints = currentPoints - cost
    updatePointsEarned(customerUid, businessUid, newPoints)
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Scan a Customer QR Code</h1>

        <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Customer Code
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Scan the customer QR code:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRScanner resultSetter={setEncodedReward} afterScan={() => setQrOpen(false)} />
              </div>

              <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <Dialog open={claimOpen} onClose={() => setClaimOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Claim Discount
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Click To Reward: {description}:</p>
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

        <button className="general-button" onClick={() => setQrOpen(true)}>
          Scan
        </button>

        <h2 className="white-div font-bold text-nondark p-2 text-center">{inputValidation}</h2>

        <HomeButton router={router} where="/business/home" />
      </div>
    </div>
  )
}
