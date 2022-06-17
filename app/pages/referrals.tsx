import { getDocs, query, where } from '@firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { auth, createCollection } from '../firebase'
import { Referral } from '../types/FirestoreCollections'
import { Dialog } from '@headlessui/react'
import { createHash } from 'crypto'
import HomeButton from '../components/HomeButton'
import QRUid from '../components/QRUid'

export default function Referrals () {
  const router = useRouter()

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)
  const [activeReferral, setActiveReferral] = useState<Referral>(
    { place: '', review: '', date: '', userEmail: '', image: '', discount: '', businessUid: '', customerUid: '' }
  )

  // api call to firestore to run on page load
  // get all user referrals and businesses
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(query(collectionsRef, where('customerUid', '!=', auth.currentUser!.uid)))

      // get relevant information from document
      setReferrals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  // Create QR code image.
  const [qrComponent, setQrComponent] = useState(<div></div>)

  useEffect(() => {
    const input = activeReferral.businessUid + '-' + auth.currentUser!.uid
    // setQrImage(qrCodeWriter.write(input, 256, 256))
    setQrComponent(<QRUid uid={input} />)
  }, [qrOpen])

  // display each referral from state, use combobox for dropdown menu
  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
          <Dialog.Panel className="w-full max-w-md overflow-hidden ultralight-div p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
            <Dialog.Title as="h3" className="font-bold text-center text-2xl text-dark-nonblack">
              Referral code
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col grow text-center">
                <p>Scan this at {activeReferral.place} to redeem:</p>
                <p>&quot;{activeReferral.discount}&quot;</p>
              </div>
            </Dialog.Description>

            {qrComponent}

            <button className="general-button"
              onClick={() => setQrOpen(false)}>Cancel</button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col gap-4 p-4 lighter-div">
        <h1 className="font-bold text-center text-4xl text-dark-nonblack">Current Referrals</h1>

        {referrals.length > 0
          ? referrals.map(ReferralEntry)
          : <p className="text-warning text-2xl p-8">There are no active referrals from others.</p>}

        <HomeButton router={router} />
      </div>
    </div>
  )

  function ReferralEntry (ref: Referral) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg max-w-max">
        <div className="flex flex-row gap-4 place-content-start">
          <img
            src={ref.image}
            className="aspect-square object-contain h-60 place-self-center p-1 default-div" />

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
            <h1 className="font-bold text-dark-nonblack">PLACE</h1>
            <p className="col-span-2">{ref.place}</p>

            <h1 className="font-bold text-dark-nonblack w-32">DISCOUNT</h1>
            <p className="col-span-2">{ref.discount}</p>

            <h1 className="font-bold text-dark-nonblack">DATE</h1>
            <p className="col-span-2">{ref.date}</p>

            <h1 className="font-bold text-dark-nonblack row-span-3">REVIEW</h1>
            <p className="col-span-2 row-span-3 w-60">{ref.review}</p>
          </div>
        </div>

        <button className="general-button" onClick={() => {
          setActiveReferral(ref)
          setQrOpen(true)
        }}>
          USE REFERRAL
        </button>
      </div>
    )
  }
}
