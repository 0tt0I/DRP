import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import HomeButton from '../components/HomeButton'
import QRUid from '../components/QRUid'
import { Dialog } from '@headlessui/react'
import { createHash } from 'crypto'
import { getUserDiscounts } from '../services/customerInfo'
import { getUid } from '../services/authInfo'

interface ReedemableDiscount {
  pointsEarned: number,
  pointsNeeded: number,
  description: string,
  discountUid: string,
  place: string
}

export default function RedeemReward () {
  const router = useRouter()
  const uid = useRef(getUid())

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)

  const [discounts, setDiscounts] = useState<ReedemableDiscount[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const getBusinessIds = async () => {
      const jsonResponse = await getUserDiscounts(uid.current)
      setDiscounts(jsonResponse.discounts)
    }

    if (initialLoad) {
      getBusinessIds()
      setInitialLoad(false)
    }
  })

  return (
    <div className="home-div">
      <div className="home-subdiv-l">
        <h1>
              Redeem Referrals
        </h1>
        {discounts.length > 0
          ? discounts.map(DiscountEntry)
          : <p className="text-warning text-2xl p-8">There are no active discounts.</p>}

        <HomeButton router={router} where="/" />
      </div>

    </div>
  )

  function DiscountEntry (discount: ReedemableDiscount) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(discount)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg min-w-max">
        <div className="flex flex-row gap-4 place-content-start">

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 min-w-max">
            <h1 className="font-bold text-dark-nonblack">Place</h1>
            <p className="col-span-2">{discount.place}</p>

            <h1 className="font-bold text-dark-nonblack">Description</h1>
            <p className="col-span-2 break-all w-80">{discount.description}</p>

            <h1 className="font-bold text-dark-nonblack w-32">Points Needed</h1>
            <p className="col-span-2">{discount.pointsNeeded}</p>

            <h1 className="font-bold text-dark-nonblack w-32">Points Earnt</h1>
            <p className="col-span-2">{discount.pointsEarned}</p>

          </div>

          <button className="general-button" onClick={() => setQrOpen(true)}>
            Redeem
          </button>

          <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
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
                  <QRUid uid={uid.current + '-' + discount.discountUid}/>
                </div>

                <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    )
  }
}
