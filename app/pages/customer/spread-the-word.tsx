import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Camera from '../../components/Camera'
import HomeButton from '../../components/HomeButton'
import QRScanner from '../../components/QRScanner'
import { getUid, getUserEmail } from '../../services/authInfo'
import { getNameAndDiscount } from '../../services/businessInfo'
import { addReferral } from '../../services/customerInfo'

export default function AddReferral () {
  const router = useRouter()

  // states for input fields
  const [newReview, setNewReview] = useState('')

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')

  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState<string | undefined>(undefined)

  // state for business UID
  const [businessUid, setBusinessUid] = useState('')

  // state for business name
  const [businessName, setBusinessName] = useState('')
  // state for business UID
  const [businessDiscount, setBusinessDiscount] = useState('')

  // modal state for popup and info for qr-scan
  const [qrOpen, setQrOpen] = useState(false)

  // Modal state for the picture-taking popup
  const [picOpen, setPicOpen] = useState(false)

  const createReferral = async () => {
    if (newReview === '' || imageRef === undefined || imageRef === '' || businessUid === '' || businessName === '') {
      // set error message to be displayed
      setInputValidation('Fill in all fields and take a picture!')
    } else {
      // set input validation to success
      setInputValidation('Success!')

      // get current time and format correctly
      const current = new Date()
      const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

      // get user email (shouldn't be null as user already logged in)
      const userEmail = getUserEmail()

      // null check
      if (userEmail) {
        const discountString = businessDiscount === '' ? 'Ask about the discount at the till' : businessDiscount

        const newReferral = { place: businessName, review: newReview, date, userEmail, image: '', discount: discountString, businessUid, customerUid: getUid() }

        await addReferral(newReferral, imageRef!)

        // set taken image to empty again
        setImageRef(undefined)
        router.push('/my-referrals')
      }
    }
  }

  // Update the input validation if uid is updated:
  useEffect(() => {
    if (businessUid === '') {
      setInputValidation('No current data.')
    } else {
      const changeState = async () => {
        const jsonResponse = await getNameAndDiscount(businessUid)
        if (jsonResponse.name === '') {
          setInputValidation('Invalid QR Code')
        } else {
          setInputValidation('Place Scanned: ' + jsonResponse.name)
          setBusinessName(jsonResponse.name)
          setBusinessDiscount(jsonResponse.discount)
        }
      }

      changeState()
    }
  }, [businessUid])

  useEffect(() => {
    if (imageRef === undefined || imageRef === '') {
      setInputValidation('Picture cancelled or not taken.')
    } else {
      setInputValidation('Picture taken and confirmed.')
    }
  }, [imageRef])

  return (
    <div className="relative flex w-screen h-screen items-center justify-center">
      <div className="default-div rounded-lg flex flex-col p-4 gap-2 w-fit sm:w-96">
        <h2 className="font-bold text-center text-4xl text-dark-nonblack">
          Spread the word
        </h2>
        <Dialog open={qrOpen} onClose={() => null} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Place QR Code
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Ask to scan the QR code at the till to refer:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRScanner resultSetter={setBusinessUid} afterScan={() => setQrOpen(false)} />
              </div>

              <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="gap-2 flex flex-col p-2 darker-div">
          <label>
            <textarea
              rows={3}
              placeholder="How was your food / drink / experience? What makes this place unique? "
              className="input"
              onChange={(event) => setNewReview(event.target.value)}/>
          </label>
        </div>

        <Dialog open={picOpen} onClose={() => null} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Review Picture
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Take a picture to go with your review:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <Camera imageRef={setImageRef} existingRef={imageRef} />
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

        <button className="general-button" onClick={() => setQrOpen(true)}>
          Scan Place QR Code
        </button>

        <button className="general-button" onClick={() => setPicOpen(true)}>
          Add Picture to Review
        </button>

        <h1 className="white-div font-bold text-nondark p-2 text-center">{inputValidation}</h1>

        <br />

        <button onClick={createReferral} className="general-button">Post</button>

        <HomeButton router={router} />

      </div>
    </div>
  )
}
