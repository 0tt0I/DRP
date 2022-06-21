import { Dialog } from '@headlessui/react'
import React, { useState } from 'react'
import Camera from '../components/Camera'

export default function BusinessSignup () {
  // Current image.
  const [picOpen, setPicOpen] = useState(false)
  const [imageRef, setImageRef] = useState<string | undefined>(undefined)

  // TODO: Not sure how to create an upload box, so here is a camera instead.
  return (
    <div className="home-div">
      <Dialog open={picOpen} onClose={() => setPicOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
          <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
            <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
            Business Picture
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col grow text-center">
                <p>Take a picture to advertise your business:</p>
              </div>
            </Dialog.Description>

            <div className="place-self-center">
              <Camera imageRef={setImageRef} existingRef={imageRef} constraints={{
                width: 192,
                height: 192,
                facingMode: 'user'
              }} />
            </div>

            <button className="general-button" onClick={() => setPicOpen(false)}>
              Confirm
            </button>

            <button className="general-button" onClick={() => {
              setPicOpen(false)
              setImageRef(undefined)
            }}>
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="home-subdiv-l">
        <h1>Business Sign-Up</h1>

        <div className="flex flex-col gap-2 w-96 p-2 default-div">
          <h1 className="font-bold text-center">Business Details</h1>

          <label>
            <input type="text"
              placeholder="Business Name"
              className="input" />
          </label>
          <label>
            <input type="text"
              placeholder="Address"
              className="input" />
          </label>
          <label>
            <input type="email"
              placeholder="Email"
              className="input" />
          </label>
          <label>
            <input type="password"
              placeholder="Password"
              className="input" />
          </label>
        </div>

        <div className="flex flex-col gap-2 w-96 p-2 default-div">
          <h1 className="font-bold text-center">Business Image</h1>

          <div className="flex flex-row gap-2 p-2">
            {imageRef === undefined
              ? <div className="w-48 h-48 darker-div place-self-center"></div>
              : <img src={imageRef} className="w-48 h-48 rounded-lg place-self-center" />}

            <div className="flex flex-col gap-2 grow">
              <button className="general-button" onClick={() => setPicOpen(true)}>
                Open Camera
              </button>

              <button className="general-button">
                Upload Image
              </button>
            </div>
          </div>
        </div>

        <br />

        <p className="white-div font-bold text-nondark p-2 text-center">
          [TODO: INPUT VALIDATION STATUS]
        </p>

        <button className="general-button">
          Sign Up
        </button>
      </div>
    </div>
  )
}
