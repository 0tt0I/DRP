import { Dialog } from '@headlessui/react'
import { addDoc, collection, CollectionReference, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import HomeButton from '../components/HomeButton'
import { auth, db } from '../firebase'
import { Discount } from '../types/FirestoreCollections'
import { createHash } from 'crypto'

export default function SetDiscounts () {
  const router = useRouter()

  // modal state for popup and info for qr-scan
  const [inputOpen, setInputOpen] = useState(false)

  // state for description inpu
  const [newDescription, setNewDescription] = useState('')
  // state for points input
  const [newPoints, setNewPoints] = useState(0)
  // state for discount collection ref

  const businessUid = auth.currentUser!.uid
  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>

  // set state for referrals
  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    const getDiscounts = async () => {
      const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>

      const data = await getDocs(discountCollection)
      // get relevant information from document
      setDiscounts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getDiscounts()
  })

  const createDiscount = async () => {
    // business should already be logged in
    const businessUid = auth.currentUser!.uid

    console.log(businessUid)

    const newDiscount = { description: newDescription, points: newPoints }

    const data = await getDocs(discountCollection)
    // get relevant information from document
    setDiscounts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    await addDoc(discountCollection, newDiscount)
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <Dialog open={inputOpen} onClose={() => setInputOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Add Discount
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Ask to scan the QR code at the till to refer:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <label>
                  <input
                    placeholder="Description: "
                    className="input"
                    onChange={(event) => setNewDescription(event.target.value)}/>
                </label>
                <label>
                  <input
                    placeholder="Points: "
                    className="input"
                    type="tel"
                    onChange={(event) => {
                      setNewPoints(Number(event.target.value))
                    }}/>
                </label>
              </div>

              <button className="general-button" onClick={() => {
                createDiscount()
                setInputOpen(false)
              }}>
                Submit
              </button>
              <button className="general-button" onClick={() => setInputOpen(false)}>
                Cancel
              </button>

            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="flex flex-col gap-4 p-4 lighter-div">
          <h2 className="font-bold text-center text-4xl text-dark-nonblack">Set Discounts</h2>

          {discounts.length > 0
            ? discounts.map(DiscountEntry)
            : <p className="text-warning text-2xl p-8">There are no active discounts.</p>}

          <button className="general-button" onClick={() => setInputOpen(true)}>  Add </button>
          <HomeButton router={router} where="/business-home" />
        </div>
      </div>
    </div>
  )

  function DiscountEntry (ref: Discount) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg max-w-max">
        <div className="flex flex-row gap-4 place-content-start">

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
            <h1 className="font-bold text-dark-nonblack">Description: </h1>
            <p className="col-span-2">{ref.description}</p>

            <h1 className="font-bold text-dark-nonblack w-32">Points Worth: </h1>
            <p className="col-span-2">{ref.points}</p>
          </div>
        </div>
      </div>
    )
  }
}
