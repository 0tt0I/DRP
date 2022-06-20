import { doc, getDoc, collection, CollectionReference, getDocs, addDoc } from '@firebase/firestore'
import { db } from '../firebase'
import { Discount } from '../types/FirestoreCollections'

export async function getDiscountInfo (businessUid: string, discountUid: string): Promise<[number, string]> {
  const docRef = doc(db, 'businesses', businessUid, 'discounts', discountUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return [(docSnap.data().points), docSnap.data().description]
  } else {
    return [-1, ''] // document doesn't exist
  }
}

export async function getAllDiscounts (businessUid: string): Promise<Discount[]> {
  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  const data = await getDocs(discountCollection)
  // get relevant information from document

  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}

export async function addDiscount (businessUid: string, discount: Discount): Promise<void> {
  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  await addDoc(discountCollection, discount)
}
