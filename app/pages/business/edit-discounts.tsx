import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import HomeButton from '../../components/HomeButton'
import { Discount } from '../../types/FirestoreCollections'
import { createHash } from 'crypto'
import { addDiscount, getAllDiscounts } from '../../services/discountInfo'
import { getUid } from '../../services/authInfo'

export default function SetDiscounts () {
  const router = useRouter()

  // modal state for popup and info for qr-scan
  const [inputOpen, setInputOpen] = useState(false)

  // state for description inpu
  const [newDescription, setNewDescription] = useState('')
  // state for points input
  const [newPoints, setNewPoints] = useState(0)
  // state for discount collection ref

  const businessUid = useRef(getUid())

  // set state for referrals
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  const getDiscountList = async () => {
    const jsonResponse = await getAllDiscounts(businessUid.current)
    setDiscounts(jsonResponse.discounts)
  }

  useEffect(() => {
    if (initialLoad) {
      getDiscountList()
      setInitialLoad(false)
    }
  }, [])

  const createDiscount = async () => {
    const newDiscount: Discount = {
      description: newDescription,
      points: newPoints
    }

    await addDiscount(businessUid.current, newDiscount)
    await getDiscountList()
  }

  return (
    <div className="home-div">
      <div className="flex flex-col gap-8 p-4 lighter-div">
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

        <div className="flex flex-col gap-4 p-4">
          <h2 className="font-bold text-center text-4xl text-dark-nonblack">Set Discounts</h2>

          {discounts.length > 0
            ? discounts.map(DiscountEntry)
            : <p className="text-warning text-2xl p-8">There are no active discounts.</p>}

          <button className="general-button" onClick={() => setInputOpen(true)}>  Add </button>
          <HomeButton router={router} where="/business/business-home" />
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
