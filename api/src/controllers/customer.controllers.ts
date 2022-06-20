import { doc, getDoc } from '@firebase/firestore'
import { Request, Response } from 'express'
import { db } from 'src/plugins/firebase'

export async function customerGetPointsController(req: Request, res: Response) {

  const customerUid: string = req.body.customerUid
  const businessUid: string = req.body.businessUid
    
  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const pointsEarned = docSnap.data().pointsEarned
    res.status(200).json({ pointsEarned })
  } else {
    res.status(200).json({ pointsEarned: -1 })
  }
}