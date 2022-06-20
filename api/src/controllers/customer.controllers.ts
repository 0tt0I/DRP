import { doc, getDoc, updateDoc, collection, CollectionReference, getDocs, query, where } from '@firebase/firestore'
import { Request, Response } from 'express'
import { Referral } from '../models/FirestoreCollections'
import { db } from '../plugins/firebase'

export async function customerGetPointsController (req: Request, res: Response) {
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

export async function customerUpdatePointsController (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid
  const businessUid: string = req.body.businessUid
  const newPoints: number = req.body.newPoints

  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  await updateDoc(docRef, {
    pointsEarned: newPoints
  })

  res.status(200)
}

export async function customerGetUserReferrals (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid

  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>
  const data = await getDocs(query(collectionsRef, where('customerUid', '==', customerUid)))

  // get relevant information from document
  const referrals = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

  res.status(200).json({ referrals })
}
