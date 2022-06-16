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
    <div>
      <div className="gap-2 flex flex-col bg-violet-400 p-2 rounded-lg">
        <label>
          <input
            placeholder={newDiscount}
            className="input"
            onChange={(event) => setNewDiscount(event.target.value)}/>
        </label>

        <div className="place-self-center">
          <button onClick={businessSetDiscount} className="general-button">Apply</button>
        </div>
      </div>
    </div>
  )
}
