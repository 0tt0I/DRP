import { collection, CollectionReference, doc, getDoc, getDocs, updateDoc, query, where } from '@firebase/firestore'
import { db } from '../firebase'
import { RedeemableDiscount, Referral } from '../types/FirestoreCollections'

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

export async function getOtherReferrals (customerUid: string): Promise<Referral[]> {
  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>
  const data = await getDocs(query(collectionsRef, where('customerUid', '!=', customerUid)))

  // get relevant information from document
  return (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
}

export async function getUserDiscounts (customerUid: string): Promise<RedeemableDiscount[]> {
  const acc: RedeemableDiscount[] = []

  const visitedBusinessCollection = collection(db, 'customers', customerUid, 'businesses')

  const querySnapshot = await getDocs(visitedBusinessCollection)
  querySnapshot.forEach(async (business) => {
    const docPoints = business.data().pointsEarned

    const docSnap = await getDoc(doc(db, 'businesses', business.id))
    if (docSnap.exists()) {
      const currentDiscountDocs = await getDocs(query(collection(db, 'businesses', business.id, 'discounts'), where('points', '<=', docPoints)))
      currentDiscountDocs.forEach(async (discount) => {
        const data = discount.data()
        acc.push({ pointsEarned: docPoints, pointsNeeded: data.points, description: data.description, discountUid: discount.id, place: docSnap.data().name })
      })
    } else {
      // error handling - should never happen
    }
  })

  return acc
}
