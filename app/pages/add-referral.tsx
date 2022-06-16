import { Dialog } from '@headlessui/react'
import { getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Camera from '../components/Camera'
import QRScanner from '../components/QRScanner'
import { auth, createCollection, db, storage } from '../firebase'
import { Referral } from '../types/FirestoreCollections'

export default function AddReferral () {
  const router = useRouter()

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newReview, setNewReview] = useState('')

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')

  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState('')

  // state for business UID
  const [businessUid, setBusinessUid] = useState('')

  // modal state for popup and info for qr-scan
  const [qrOpen, setQrOpen] = useState(false)

  const createReferral = async () => {
    if (newReview === '' || imageRef === '' || businessUid === '') {
      // set error message to be displayed
      setInputValidation('Fill in all fields and take a picture!')
    } else {
      const businessDoc = (await getDoc(doc(db, 'businesses', businessUid)))

      if (businessDoc.exists()) {
        // set input validation to success
        setInputValidation('Success!')

        // get current time and format correctly
        const current = new Date()
        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

        // get user email (shouldn't be null as user already logged in)
        const userEmail = auth.currentUser!.email

        // null check
        if (userEmail) {
          const discountStringField = businessDoc.get('new_customer_discount')
          const discountString = discountStringField || 'Ask about the discount at the till!'

          const placeName = businessDoc.get('name')

          const newReferral = { place: placeName, review: newReview, date, userEmail, image: '', discount: discountString, businessUid, customerUid: auth.currentUser!.uid }

          // add doc to firestore
          const docRef = await addDoc(collectionsRef, newReferral)

          // get the image storage bucket from firebase storage
          const imageStorage = ref(storage, `referrals/${docRef.id}/image`)

          // upload image, then update firestore document with image's download URL
          await uploadString(imageStorage, imageRef, 'data_url').then(
            async snapshot => {
              const downloadURL = await getDownloadURL(imageStorage)

              await updateDoc(doc(db, 'referrals', docRef.id), {
                image: downloadURL
              })
            }
          )

          newReferral.image = imageRef

          // set taken image to empty again
          setImageRef('')
          router.push('/my-referrals')
        }
      } else {
        setInputValidation('Invalid QR code, try scanning again!')
      }
    }
  }

  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <div className="bg-violet-300 rounded-lg flex flex-col p-4 gap-2">
        <h2 className="font-bold text-center text-4xl text-violet-800">
          Make a Referral
        </h2>
        <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg bg-violet-100 p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
              <Dialog.Title as="h3" className="font-bold text-center text-2xl text-violet-800">
              Place
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Ask to scan the QR code at the till to refer:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRScanner resultSetter={setBusinessUid}/>
              </div>

              <button className="general-button"
                onClick={() => {
                  setQrOpen(false)
                  if (businessUid === '') {
                    setInputValidation('Scan Failed!')
                  } else {
                    setInputValidation('Scanned Successfully!')
                  }
                }}>Scan</button>

              <button className="general-button"
                onClick={() => {
                  setQrOpen(false)
                }}>Cancel</button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="gap-2 flex flex-col bg-violet-400 p-2 rounded-lg">
          <label>
            <input
              placeholder="Review: "
              className="input"
              onChange={(event) => setNewReview(event.target.value)}/>
          </label>
        </div>

        <button className="general-button" onClick={() => {
          setQrOpen(true)
        }}>
          Add Place
        </button>

        <Camera imageRef={setImageRef}/>

        <div className="place-self-center">
          <button onClick={createReferral} className="general-button">ADD REFERRAL</button>
        </div>

        <h1 className="bg-white font-bold text-violet-600 p-2 rounded-lg text-center">{inputValidation}</h1>
      </div>
    </div>
  )
}
