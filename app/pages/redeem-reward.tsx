import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { auth } from '../firebase'
import HomeButton from '../components/HomeButton'
import QRUid from '../components/QRUid'
import { Dialog } from '@headlessui/react'

export default function BusinessQRCode () {
  const router = useRouter()
  const uid = useRef(auth.currentUser!.uid)

  // modal state for popup and info for qr-gen
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>
              Redeem Referrals
        </h1>
        <button className="general-button" onClick={() => setQrOpen(true)}>
          Your QR Code
        </button>

        <Dialog open={qrOpen} onClose={() => setQrOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Your QR Code
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Ask to scan the QR code at the till to claim!:</p>
                </div>
              </Dialog.Description>

              <div className="place-self-center">
                <QRUid uid={uid.current}/>
              </div>

              <button className="general-button" onClick={() => setQrOpen(false)}>
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <HomeButton router={router} where="/" />
      </div>
    </div>
  )
}
