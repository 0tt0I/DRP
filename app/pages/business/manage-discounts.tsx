import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Discount } from '../../types/FirestoreCollections'
import { createHash } from 'crypto'
import { addDiscount, getAllDiscounts, deleteDiscount } from '../../services/discountInfo'
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

  // state for validation status
  const [inputValidation, setInputValidation] = useState('')

  // set state for referrals
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  async function getDiscountList () {
    const jsonResponse = await getAllDiscounts(businessUid.current)
    setDiscounts([...jsonResponse.discounts])
  }

  function refreshPage () {
    window.location.reload()
  }

  useEffect(() => {
    if (initialLoad) {
      getDiscountList()
      setInitialLoad(false)
    }
  }, [])

  const createDiscount = async () => {
    if (newPoints <= 0 || newDescription === '') {
      return false
    }

    const newDiscount: Discount = {
      description: newDescription,
      points: newPoints
    }

    await addDiscount(businessUid.current, newDiscount)
    setDiscounts((oldDiscounts) => oldDiscounts.concat([newDiscount]))

    return true
  }

  const removeDiscount = async (discountUid: string) => {
    await deleteDiscount(businessUid.current, discountUid)
    getDiscountList()
  }

  return (
    <div className="home-div">
      <div className="home-subdiv-l">
        <Dialog open={inputOpen} onClose={() => setInputOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Add Discount
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p></p>
                </div>
              </Dialog.Description>

              <div className="flex flex-col gap-2 p-2 lighter-div">
                <label>
                  <input
                    placeholder="Description: Spend £10 and get a free pint!"
                    className="input"
                    onChange={(event) => setNewDescription(event.target.value)}/>
                </label>
                <label>
                  <input
                    placeholder="Points: Number of points to award the promoter"
                    className="input"
                    type="tel"
                    onChange={(event) => {
                      setNewPoints(Number(event.target.value))
                    }}/>
                </label>
              </div>

              {inputValidation !== ''
                ? <p className="white-div p-2 text-dark-nonblack font-bold text-center">{inputValidation}</p>
                : <></>}

              <button className="general-button" onClick={() => {
                createDiscount().then(succ => {
                  if (succ) {
                    setInputOpen(false)
                    refreshPage()
                  } else {
                    setInputValidation('Please fill in both the description and points field.')
                  }
                })
                // TODO: find better way to ensure new discount appears in list
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
          <h2 className="font-bold text-center text-4xl text-dark-nonblack">Manage Discounts</h2>
          <p className='place-self-center'>These are the discounts you are offering to new customers gained by Mira. </p>
          <p className='place-self-center'>Define the amount of points a promoter should receive for bringing <br /> in a customer that redeems one of these discounts. </p>

          {discounts.length > 0
            ? discounts.map(DiscountEntry)
            : <p className="text-warning text-2xl p-8">There are no active discounts.</p>}

          <button className="general-button" onClick={() => setInputOpen(true)}>  Add Discount </button>
          <button onClick={() => router.push('/business/manage')} className="general-button">
            Back to Your Business
          </button>
        </div>
      </div>
    </div>
  )

  function DiscountEntry (ref: Discount) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg min-w-max grow">
        <div className="flex flex-col sm:flex-row gap-4 place-content-start min-w-max grow">
          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 grow">
            <h1 className="font-bold text-dark-nonblack">Description: </h1>
            <p className="col-span-2">{ref.description}</p>

            <h1 className="font-bold text-dark-nonblack w-16">Points Worth: </h1>
            <p className="col-span-2">{ref.points}</p>
          </div>

          <div className='place-self-end sm:place-self-center'>
            <button className='general-button' onClick={() => {
              removeDiscount(ref.id ? ref.id : '')
              refreshPage()
              // TODO: find better way to ensure list is updated
            }}>Delete</button>
          </div>
        </div>
      </div>
    )
  }
}
