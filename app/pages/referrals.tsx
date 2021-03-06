import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Discount, Referral } from '../types/FirestoreCollections'
import { Dialog } from '@headlessui/react'
import { createHash } from 'crypto'
import HomeButton from '../components/HomeButton'
import QRUid from '../components/QRUid'
import { getOtherReferrals } from '../services/customerInfo'
import { getAllDiscounts } from '../services/discountInfo'
import { getUid } from '../services/authInfo'

export default function Referrals () {
  const router = useRouter()

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  // modal state for popup and info for qr-gen
  const [referralOpen, setReferralOpen] = useState(false)
  const emptyReferral = {
    place: '', review: '', date: '', userEmail: '', image: '', discount: '', businessUid: '', customerUid: ''
  }
  const [activeReferral, setActiveReferral] = useState<Referral>(emptyReferral)

  const uid = useRef(getUid())

  // api call to firestore to run on page load
  // get all user referrals and businesses
  useEffect(() => {
    const getUsers = async () => {
      const data = await getOtherReferrals(uid.current)
      setReferrals(data)
    }

    if (initialLoad) {
      getUsers()
      setInitialLoad(false)
    }
  }, [])

  // Create QR code image.
  const [qrOpen, setQrOpen] = useState(false)
  const [qrComponent, setQrComponent] = useState(<div></div>)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>(
    { description: '', points: 0, id: '' }
  )

  useEffect(() => {
    const input = activeReferral.businessUid +
      '-' + activeReferral.customerUid +
      '-' + selectedDiscount.id +
      '-' + uid.current
    // setQrImage(qrCodeWriter.write(input, 256, 256))
    setQrComponent(<QRUid uid={input} />)
  }, [selectedDiscount])

  useEffect(() => {
    setQrOpen(true)
  }, [qrComponent])

  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    const getDiscounts = async () => {
      if (referralOpen) {
        setDiscounts(await getAllDiscounts(activeReferral.businessUid))
      }
    }

    getDiscounts()
  }, [referralOpen])

  const qrDialogue = (
    <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
        <Dialog.Panel className="w-full max-w-md overflow-hidden ultralight-div p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
          <Dialog.Title as="h3" className="font-bold text-center text-2xl text-dark-nonblack">
            Referral code
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col grow text-center">
              <p>Scan this at {activeReferral.place} to redeem:</p>
              <p>&quot;{selectedDiscount.description}&quot;</p>
            </div>
          </Dialog.Description>

          {qrComponent}

          <button className="general-button"
            onClick={() => setQrOpen(false)}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )

  // display each referral from state, use combobox for dropdown menu
  return (
    <div className="relative grid h-screen justify-center items-center p-2 sm:p-4">
      <Dialog open={referralOpen} onClose={() => setReferralOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
          <Dialog.Panel className="w-full max-w-md overflow-hidden ultralight-div p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
            <Dialog.Title as="h3" className="font-bold text-center text-2xl text-dark-nonblack">
              Referral code
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col grow text-center">
                <p>Select one of {activeReferral.place}&apos;s discounts to redeem:</p>
              </div>
            </Dialog.Description>

            {qrDialogue}

            {discounts.length > 0
              ? discounts.map(DiscountEntry)
              : <p className="text-warning text-2xl p-8">There are no active disounts at this business.</p>}

            <button className="general-button"
              onClick={() => setReferralOpen(false)}>Cancel</button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 lighter-div">
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
        className="flex flex-col gap-4 place-content-center p-2 sm:p-4 default-div rounded-lg max-h-max">
        <div className="flex flex-row gap-4 place-content-start">
          <img
            src={ref.image}
            className="aspect-square object-contain h-32 sm:h-60 place-self-center p-1 default-div" />

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
            <h1 className="font-bold text-dark-nonblack">Place</h1>
            <p className="col-span-2">{ref.place}</p>

            <h1 className="font-bold text-dark-nonblack w-18 sm:w-24">Discount</h1>
            <p className="col-span-2">{ref.discount}</p>

            <h1 className="font-bold text-dark-nonblack">Date</h1>
            <p className="col-span-2">{ref.date}</p>

            <h1 className="font-bold text-dark-nonblack row-span-3">Review</h1>
            <p className="col-span-2 row-span-3 w-32 sm:w-48">{ref.review}</p>
          </div>
        </div>

        <button className="general-button" onClick={() => {
          setActiveReferral(ref)
          setReferralOpen(true)
          setQrOpen(false)
        }}>
          Use Referral
        </button>
      </div>
    )
  }

  function DiscountEntry (discount: Discount) {
    return (
      <button
        onClick = {() => {
          setSelectedDiscount(discount)
        }}
        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
      >
        <div className="ml-4">
          <p className="text-sm text-gray-500">
            {discount.description}
          </p>
        </div>
      </button>
    )
  }
}
