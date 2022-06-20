import { collection, CollectionReference, doc, getDoc, getDocs, updateDoc, query, where, addDoc } from '@firebase/firestore'
import { ref } from '@firebase/storage'
import { getDownloadURL, uploadString } from 'firebase/storage'
import { db, storage } from '../firebase'
import { RedeemableDiscount, Referral } from '../types/FirestoreCollections'

export async function getPointsEarned (customerUid: string, businessUid: string) {
  const res = await fetch('/api/customer/get-points', {
    method: 'POST',
    body: JSON.stringify({ customerUid, businessUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function updatePointsEarned (customerUid: string, businessUid: string, newPoints: number): Promise<void> {
  const res = await fetch('/api/customer/update-points', {
    method: 'POST',
    body: JSON.stringify({ customerUid, businessUid, newPoints }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getUserReferrals (customerUid: string) {
  const res = await fetch('/api/customer/get-user-referrals', {
    method: 'POST',
    body: JSON.stringify({ customerUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
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

export async function addReferral (referral: Referral, imageRef: string): Promise<void> {
  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>

  // add doc to firestore
  const docRef = await addDoc(collectionsRef, referral)

  // get the image storage bucket from firebase storage
  const imageStorage = ref(storage, `referrals/${docRef.id}/image`)

  // upload image, then update firestore document with image's download URL
  await uploadString(imageStorage, imageRef, 'data_url').then(
    async snapshot => {
      const downloadURL = await getDownloadURL(imageStorage)

      await updateDoc(doc(db, 'referrals', docRef.id), {
        image: downloadURL
      })
    }
  )
}
