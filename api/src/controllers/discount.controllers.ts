import { doc, getDoc, collection, CollectionReference, getDocs, addDoc, deleteDoc } from '@firebase/firestore'
import { Request, Response } from 'express'
import { query, where } from 'firebase/firestore'
import { Discount } from '../models/FirestoreCollections'
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

export async function discountsGetAllController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid

  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  const data = await getDocs(discountCollection)
  // get relevant information from document

  const discounts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  res.status(200).json({ discounts })
}

export async function discountAddController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const discount: Discount = req.body.discount

  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  await addDoc(discountCollection, discount)
  res.status(200)
}

export async function discountDeleteController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const discountUid: string = req.body.discountUid

  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  await deleteDoc(doc(discountCollection, discountUid))
  res.status(200)
}

export async function discountGetEligibleController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const pointsEarned: number = req.body.pointsEarned

  const discountCollection = collection(db, 'businesses', businessUid, 'discounts') as CollectionReference<Discount>
  const eligibleDocs = await getDocs(query(discountCollection, where('points', '<=', pointsEarned)))

  const discounts = eligibleDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  res.status(200).json({ discounts })
}
