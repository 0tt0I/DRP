import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase'

export default function SetDiscount () {
  const router = useRouter()

  const [newDiscount, setNewDiscount] = useState('')
  const businessDoc = doc(db, 'businesses', auth.currentUser!.uid)

  useEffect(() => {
  // TODO: move db accesses to backend
    async function getDiscount () {
    // getting document if exists from businesses collection
      const docSnap = await getDoc(businessDoc)

      // get current discount value if it's set and reroute
      // if a business isn't logged in
      if (docSnap.get('new_customer_discount')) {
        setNewDiscount(docSnap.get('new_customer_discount'))
      } else if (docSnap.exists()) {
        setNewDiscount('no discount set')
      } else {
        router.push('/')
      }
    }

    getDiscount()
  }, [])

  async function businessSetDiscount () {
    await updateDoc(businessDoc, {
      new_customer_discount: newDiscount
    })
  }

  return (
    <div className="home-div">
      <div className="home-subdiv">
        <h1>Set a new Discount</h1>

        <label className="p-2 darker-div">
          <input
            placeholder={newDiscount}
            className="input"
            onChange={(event) => setNewDiscount(event.target.value)}/>
        </label>

        <button onClick={businessSetDiscount} className="general-button">Apply</button>

        <button onClick={() => router.push('/business-home')} className="general-button">
          Go back to Home
        </button>
      </div>
    </div>
  )
}
