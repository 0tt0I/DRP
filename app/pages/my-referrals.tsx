import React, { useEffect, useState } from 'react'
import { auth, createCollection } from '../firebase'
import { getDocs, query, where } from 'firebase/firestore'
import { Referral } from '../types/FirestoreCollections'
import { useRouter } from 'next/router'
import { createHash } from 'crypto'

export default function MyReferrals () {
  const router = useRouter()

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(query(collectionsRef, where('customerUid', '==', auth.currentUser!.uid)))

      // get relevant information from document
      setReferrals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  // display each referral from state, use combobox for dropdown menu
  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <div className="flex flex-col gap-4 p-4 rounded-lg bg-violet-200">
        <h1 className="font-bold text-center text-4xl text-violet-800">My Referrals</h1>
        {referrals.map(ReferralEntry)}
      </div>

      <button onClick={() => router.push('/')} className="general-button">
      Back To Home
      </button>
    </div>
  )

  function ReferralEntry (ref: Referral) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 bg-violet-300 rounded-lg max-w-max">
        <div className="flex flex-row gap-4 place-content-start">
          <img
            src={ref.image}
            className="aspect-square object-contain h-60 place-self-center rounded-lg bg-violet-400 p-1" />

          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 w-fit">
            <h1 className="font-bold text-violet-900">PLACE</h1>
            <p className="col-span-2">{ref.place}</p>

            <h1 className="font-bold text-violet-900 w-32">DISCOUNT</h1>
            <p className="col-span-2">{ref.discount}</p>

            <h1 className="font-bold text-violet-900">DATE</h1>
            <p className="col-span-2">{ref.date}</p>

            <h1 className="font-bold text-violet-900 row-span-3">REVIEW</h1>
            <p className="col-span-2 row-span-3 w-60">{ref.review}</p>
          </div>
        </div>
      </div>
    )
  }
}
