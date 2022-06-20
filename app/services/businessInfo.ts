import { doc, getDoc } from '@firebase/firestore'
import { db } from '../firebase'

export async function getNameAndDiscount (businessUid: string): Promise<[string, string]> {
  const businessDoc = (await getDoc(doc(db, 'businesses', businessUid)))

  if (businessDoc.exists()) {
    return [businessDoc.get('name'), businessDoc.get('new_customer_discount')]
  } else {
    return ['', '']
  }
}
