import React, { useEffect, useState } from 'react'
import { auth, createCollection } from '../firebase'
import { getDocs, query, where } from 'firebase/firestore'
import { Referral } from '../types/FirestoreCollections'
import { useRouter } from 'next/router'
import { createHash } from 'crypto'
import { BrowserQRCodeSvgWriter } from '@zxing/browser'
import { Dialog } from '@headlessui/react'

export default function MyReferrals () {
  const router = useRouter()

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(query(collectionsRef, where('customerUid', '==', auth.currentUser!.uid)))

      // get relevant information from document
      setReferrals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)
  const [activeReferral, setActiveReferral] = useState<Referral>(
    { place: '', review: '', date: '', userEmail: '', image: '', discount: '', businessUid: '', customerUid: '' }
  )

  const qrCodeWriter = new BrowserQRCodeSvgWriter()
  const [qrImage, setQrImage] = useState<SVGSVGElement>()

  useEffect(() => {
    const input = 'mock point redemption'
    setQrImage(qrCodeWriter.write(input, 150, 150))
  }, [qrOpen])

  // display each referral from state, use combobox for dropdown menu
  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
          <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg bg-violet-100 p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
            <Dialog.Title as="h3" className="font-bold text-center text-2xl text-violet-800">
              Referral code
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col grow text-center">
                <p>Scan this at {activeReferral.place} to redeem:</p>
                <p>&quot;You have referred 5 new customers!&quot;</p>
              </div>
            </Dialog.Description>

            <div className="place-self-center">
              <svg
                className="w-[150px] h-[150px] bg-left"
                dangerouslySetInnerHTML={{ __html: qrImage ? qrImage.innerHTML : '' }}/>
            </div>

            <button className="general-button"
              onClick={() => setQrOpen(false)}>Cancel</button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col gap-4 p-4 rounded-lg bg-violet-200">
        <h1 className="font-bold text-center text-4xl text-violet-800">My Referrals</h1>
        {referrals.map(ReferralEntry)}
      </div>

      <button onClick={() => router.push('/')} className="general-button">
      Back To Home
      </button>
    </div>
  )

  function ReferralEntry (ref: Referral) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 bg-violet-300 rounded-lg max-w-max">
        <div className="flex flex-row gap-4 place-content-start">
          <img
            src={ref.image}
            className="aspect-square object-contain h-60 place-self-center rounded-lg bg-violet-400 p-1" />

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
            <h1 className="font-bold text-violet-900">PLACE</h1>
            <p className="col-span-2">{ref.place}</p>

            <h1 className="font-bold text-violet-900 w-32">DISCOUNT</h1>
            <p className="col-span-2">{ref.discount}</p>

            <h1 className="font-bold text-violet-900">DATE</h1>
            <p className="col-span-2">{ref.date}</p>

            <h1 className="font-bold text-violet-900 row-span-3">REVIEW</h1>
            <p className="col-span-2 row-span-3 w-60">{ref.review}</p>
          </div>
        </div>
        <button className="general-button" onClick={() => {
          setActiveReferral(ref)
          setQrOpen(true)
        }}>
          REDEEM POINTS
        </button>
      </div>
    )
  }
}
