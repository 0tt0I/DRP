import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import HomeButton from '../components/HomeButton'

export default function SetDiscounts () {
  const router = useRouter()

  // modal state for popup and info for qr-scan
  const [inputOpen, setInputOpen] = useState(false)

  // state for description input
  // eslint-disable-next-line no-unused-vars
  const [newDescription, setNewDescription] = useState('')
  // state for points input
  // eslint-disable-next-line no-unused-vars
  const [newPoints, setNewPoints] = useState('')

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Set Discounts
        </h1>
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
                      setNewPoints(event.target.value)
                    }}/>
                </label>
              </div>

              <button className="general-button" onClick={() => {
                setInputOpen(false)
                console.log(newPoints)
              }}>
                Submit
              </button>
              <button className="general-button" onClick={() => setInputOpen(false)}>
                Cancel
              </button>

            </Dialog.Panel>
          </div>
        </Dialog>

        <button className="general-button" onClick={() => setInputOpen(true)}>  Add </button>

        <HomeButton router={router} where="/business-home" />
      </div>
    </div>
  )
}
