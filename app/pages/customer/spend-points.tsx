import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import HomeButton from '../../components/HomeButton'
import QRUid from '../../components/QRUid'
import { Dialog } from '@headlessui/react'
import { createHash } from 'crypto'
import { getUid } from '../../services/authInfo'
import { Referral, Reward, VisitedBusiness } from '../../types/FirestoreCollections'
import { getVisitedBusinesses } from '../../services/customerInfo'
import { getAllRewards } from '../../services/rewardInfo'

export default function RedeemReward () {
  const router = useRouter()
  const uid = useRef(getUid())

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)

  // modal state for popup and info for displaying rewards
  const [rewardOpen, setRewardOpen] = useState(false)

  // modal state for popup and info for displaying referrals
  const [referralOpen, setReferralOpen] = useState(false)

  const [rewards, setRewards] = useState<Reward[]>([])
  const [businesses, setBusinesses] = useState<VisitedBusiness[]>([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [selectedBusiness, setSelectedBusiness] = useState<VisitedBusiness>()
  const [selectedReferral, setSelectedReferral] = useState<Referral>()

  useEffect(() => {
    const getBusinesses = async () => {
      const jsonResponse = await getVisitedBusinesses(uid.current)
      setBusinesses(jsonResponse.businesses)
    }

    if (initialLoad) {
      getBusinesses()
      setInitialLoad(false)
    }
  })

  useEffect(() => {
    const relevantRewards = async () => {
      if (selectedBusiness) {
        const jsonResponse = await getAllRewards(selectedBusiness.id!)
        setRewards(jsonResponse.rewards)
      }
    }

    relevantRewards()
  }, [rewardOpen])

  return (
    <div className="home-div">
      <div className="home-subdiv-l">
        <h1>
          Spend points
        </h1>
        {businesses.length > 0
          ? businesses.map(BusinessEntry)
          : <p className="text-warning text-2xl p-8">Go visit some businesses!</p>}

        <HomeButton router={router} />
      </div>

    </div>
  )

  function BusinessEntry (business: VisitedBusiness) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(business)).digest('hex').toString()}
        className="flex flex-col gap-4 p-4 default-div rounded-lg min-w-max">
        <div className="flex flex-row gap-4 place-content-center">

          <div className="ref-info grid grid-flow-row gap-2 w-full">
            <p className="font-bold font-1xl text-center">{business.name}</p>

            <div className='grid grid-cols-2 grid-flow-row gap-4'>
              <div className="place-self-start p-2">
                <p className="place-self-center">{business.pointsEarned} Points</p>
              </div>

              <div className="place-self-end">
                <button className="general-button" onClick={() => {
                  setSelectedBusiness(business)
                  setRewardOpen(true)
                }}>
                  Spend
                </button>
              </div>
            </div>

            {business.referral
              ? <div className='w-full place-self-end'>
                <button className="general-button place-self-center w-full" onClick={() => {
                  setSelectedReferral(business!.referral)
                  setReferralOpen(true)
                }}>
                  View Active Referral
                </button>
              </div>
              : <div></div>}

            <Dialog open={rewardOpen} onClose={() => null} className="relative z-30">
              <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
                <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
                  <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Available Rewards
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="flex flex-col grow text-center">
                      <p>Rewards Available:</p>
                    </div>
                  </Dialog.Description>

                  <div className="flex flex-col gap-2 place-self-center">
                    {rewards.length > 0
                      ? rewards.map(RewardEntry)
                      : <p className="text-warning text-2xl p-8">There are no active rewards.</p>}
                  </div>

                  <button className="general-button" onClick={() => setRewardOpen(false)}>
                Back
                  </button>
                </Dialog.Panel>
              </div>
            </Dialog>

            <Dialog open={referralOpen} onClose={() => null} className="relative z-40">
              <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
                <Dialog.Panel className="w-fit max-w-lg overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
                  <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
                    Active Referral
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="flex flex-col grow text-center">
                      <p>Your referral at {selectedReferral ? selectedReferral.place : ''}:</p>
                    </div>
                  </Dialog.Description>

                  {selectedReferral
                    ? <div
                      key={createHash('sha256').update(JSON.stringify(selectedReferral)).digest('hex').toString()}
                      className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg max-w-max">
                      <div className="flex flex-col sm:flex-row gap-4 place-content-start">
                        <img
                          src={selectedReferral.image}
                          className=" object-contain h-60 w-40 place-self-center p-1 darker-div" />

                        <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
                          <h1 className="font-bold text-dark-nonblack">Place</h1>
                          <p className="col-span-2">{selectedReferral.place}</p>

                          <h1 className="font-bold text-dark-nonblack w-32">Discount</h1>
                          <p className="col-span-2">{selectedReferral.discount}</p>

                          <h1 className="font-bold text-dark-nonblack">Date</h1>
                          <p className="col-span-2">{selectedReferral.date}</p>

                          <h1 className="font-bold text-dark-nonblack row-span-3">Review</h1>
                          <p className="col-span-2 row-span-3 w-full">{selectedReferral.review}</p>
                        </div>
                      </div>
                    </div>
                    : <></>}

                  <button className="general-button" onClick={() => setReferralOpen(false)}>
                Back
                  </button>
                </Dialog.Panel>
              </div>
            </Dialog>

          </div>
        </div>
      </div>

    )
  }

  function RewardEntry (reward: Reward) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(reward)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg min-w-max">
        <div className="grid grid-cols-3 grid-flow-row-dense gap-4 place-content-start">

          <h1 className="font-bold text-dark-nonblack">Description</h1>
          <p className="col-span-2 break-words w-48">{reward.description}</p>

          <h1 className="font-bold text-dark-nonblack w-16">Points Needed</h1>
          <p className="col-span-2">{reward.points}</p>

          <h1 className="font-bold text-dark-nonblack w-16">Points Earned</h1>
          <p className="col-span-2">{selectedBusiness?.pointsEarned}</p>

        </div>

        {selectedBusiness!.pointsEarned >= reward.points
          ? <button className="general-button" onClick={() => setQrOpen(true)}>
            Redeem
          </button>
          : <div></div>
        }

        <Dialog open={qrOpen} onClose={() => null} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Your QR Code
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Ask to scan the QR code at the till to claim!:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRUid uid={'points-' + uid.current + '-' + reward.id}/>
              </div>

              <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    )
  }
}
