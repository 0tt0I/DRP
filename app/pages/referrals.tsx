import { addDoc, getDocs } from '@firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { auth, createCollection } from '../firebase'

// type for document - todo!() move into types folder?
interface Referral {
  date: string,
  place: string,
  review: string,
  userEmail: string,
}

export default function Referrals () {
  const router = useRouter()

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newPlace, setNewPlace] = useState('')
  const [newReview, setNewReview] = useState('')

  const createReferral = async () => {
    // get current time and format correctly
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

    // get user email (shouldn't be null as user already logged in)
    const email = auth.currentUser?.email

    // add doc to firestore
    await addDoc(collectionsRef, { place: newPlace, review: newReview, date, userEmail: email })
  }

  // api call to firestore to run on page load
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(collectionsRef)

      // get relevant information from document
      setReferrals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  // display each referral from state
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Referrals
      </h1>

      <input
        placeholder="Place: "
        onChange={(event) => setNewPlace(event.target.value)}/>
      <input
        placeholder="Review: "
        onChange={(event) => setNewReview(event.target.value)}/>
      <button onClick={createReferral}> Add Referral </button>

      <div>
        {referrals.map((ref) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div>
              <br></br>
              <h1>Place: {ref.place}</h1>
              <h1>Review: {ref.review}</h1>
              <h1>Date: {ref.date}</h1>
              <h1>User Email: {ref.userEmail}</h1>
            </div>
          )
        })}
      </div>
      <br></br>
      <button onClick={() => router.push('/')}>Back To Home</button>
    </div>

  )
}
