import { doc, getDoc } from '@firebase/firestore'
import { db } from '../firebase'

export async function getNameAndDiscount (businessUid: string) {
  
  const res = await fetch('/api/business/get-name-and-discount', {
    method: 'POST',
    body: JSON.stringify({businessUid}),
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return await res.json()
}
