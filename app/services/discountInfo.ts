import { doc, getDoc, collection, CollectionReference, getDocs, addDoc } from '@firebase/firestore'
import { db } from '../firebase'
import { Discount } from '../types/FirestoreCollections'

export async function getDiscountInfo (businessUid: string, discountUid: string) {
  const res = await fetch('/api/discount/get-discount-info', {
    method: 'POST',
    body: JSON.stringify({ businessUid, discountUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getAllDiscounts (businessUid: string) {
  const res = await fetch('/api/discount/get-all-discounts', {
    method: 'POST',
    body: JSON.stringify({ businessUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function addDiscount (businessUid: string, discount: Discount): Promise<void> {
  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  await addDoc(discountCollection, discount)
}
