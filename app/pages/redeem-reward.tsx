import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../firebase'
import HomeButton from '../components/HomeButton'
import QRUid from '../components/QRUid'
import { Dialog } from '@headlessui/react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { createHash } from 'crypto'

interface ReedemableDiscount {
  pointsEarned: number,
  pointsNeeded: number,
  description: string,
  discountUid: string,
  place: string
}

export default function BusinessQRCode () {
  const router = useRouter()
  const uid = useRef(auth.currentUser!.uid)

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)

  const [discounts, setDiscounts] = useState<ReedemableDiscount[]>([])

  useEffect(() => {
    const acc: ReedemableDiscount[] = []

    const getBusinessIds = async () => {
      const visitedBusinessCollection = collection(db, 'customers', uid.current, 'businesses')

      const querySnapshot = await getDocs(visitedBusinessCollection)
      querySnapshot.forEach(async (business) => {
        const docPoints = business.data().pointsEarned

        const docSnap = await getDoc(doc(db, 'businesses', business.id))
        if (docSnap.exists()) {
          const currentDiscountDocs = await getDocs(query(collection(db, 'businesses', business.id, 'discounts'), where('points', '<=', docPoints)))
          currentDiscountDocs.forEach(async (discount) => {
            const data = discount.data()
            acc.push({ pointsEarned: docPoints, pointsNeeded: data.points, description: data.description, discountUid: discount.id, place: docSnap.data().name })
          })

          // This updates acc for every new docSnap.
          // TODO: change this later.
          setDiscounts(acc)
        } else {
          console.log('broken')
        }
      })
    }

    getBusinessIds()
  }, [])

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
