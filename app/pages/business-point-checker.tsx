import React, { useState } from 'react'
import { useRouter } from 'next/router'
import QRScanner from '../components/QRScanner'
import HomeButton from '../components/HomeButton'
import { Dialog } from '@headlessui/react'
import { BusinessPoints } from '../types/FirestoreCollections'
import { auth, db } from '../firebase'
import { doc, DocumentReference, getDoc } from 'firebase/firestore'

export default function BusinessPointChecker () {
  // Request router.
  const router = useRouter()

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')
  const [customerUid, setCustomerUid] = useState('')

  const [points, setPoints] = useState(0)

  // modal state for popup and info for qr-scan
  const [qrOpen, setQrOpen] = useState(false)

  // Close the scanner window with status:
  const closeWithStatus = async () => {
    setQrOpen(false)

    if (customerUid === '') {
      setInputValidation('Scan Failed!')
    } else {
      setInputValidation('Scanned Successfully!')

      // get points from customer collection
      const businessUid = auth.currentUser!.uid
      const docSnap = await getDoc(doc(db, 'customers', customerUid, 'businesses', businessUid) as DocumentReference<BusinessPoints>)

      if (docSnap.exists()) {
        setPoints(docSnap.data().pointsEarned)
      } else {
        setInputValidation('Something went wrong!!!')
      }
    }
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Scan a Customer QR Code</h1>

        <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Place
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Scan the customer QR code:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRScanner resultSetter={setCustomerUid} afterScan={closeWithStatus} />
              </div>

              <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
        <button className="general-button" onClick={() => setQrOpen(true)}>
          Scan
        </button>

        <h2 className="white-div font-bold text-nondark p-2 text-center">Points Earned: {points}</h2>
        <h2 className="white-div font-bold text-nondark p-2 text-center">{inputValidation}</h2>

        <HomeButton router={router} where="/business-home" />
      </div>
    </div>
  )
}