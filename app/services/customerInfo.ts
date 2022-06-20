import { doc, getDoc } from '@firebase/firestore'
import { db } from '../firebase'

export async function getPointsEarned (customerUid: string, businessUid: string): Promise<number> {
  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return (docSnap.data().pointsEarned)
  } else {
    return -1 // document doesn't exist
  }
}
