import { doc, getDoc } from '@firebase/firestore'
import { Request, Response } from 'express'
import { db } from '../plugins/firebase'

export async function discountGetInfoController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const discountUid: string = req.body.discountUid

  const docRef = doc(db, 'businesses', businessUid, 'discounts', discountUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const points = docSnap.data().points
    const description = docSnap.data().description
    res.status(200).json({ points, description })
  } else {
    // document doesn't exist
    res.status(200).json({ points: -1, description: '' })
  }
}
