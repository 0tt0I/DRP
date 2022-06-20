import { collection, CollectionReference, doc, getDoc, getDocs, updateDoc, query, where } from '@firebase/firestore'
import { db } from '../firebase'
import { Referral } from '../types/FirestoreCollections'

export async function getPointsEarned (customerUid: string, businessUid: string): Promise<number> {
  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return (docSnap.data().pointsEarned)
  } else {
    return -1 // document doesn't exist
  }
}

export async function updatePointsEarned (customerUid: string, businessUid: string, newPoints: number): Promise<void> {
  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  await updateDoc(docRef, {
    pointsEarned: newPoints
  })
}

export async function getUserReferrals (customerUid: string): Promise<Referral[]> {
  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>
  const data = await getDocs(query(collectionsRef, where('customerUid', '==', customerUid)))

  // get relevant information from document
  return (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
}
