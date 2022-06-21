import { doc, getDoc, collection, CollectionReference, getDocs, addDoc, deleteDoc } from '@firebase/firestore'
import { Request, Response } from 'express'
import { query, where } from 'firebase/firestore'
import { Reward } from '../models/FirestoreCollections'
import { db } from '../plugins/firebase'

export async function rewardGetInfoController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const rewardUid: string = req.body.rewardUid

  const docRef = doc(db, 'businesses', businessUid, 'rewards', rewardUid)
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

export async function rewardsGetAllController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid

  const rewardCollection = collection(db, 'businesses', businessUid, 'rewards') as CollectionReference<Reward>
  const data = await getDocs(rewardCollection)
  // get relevant information from document

  const rewards = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  res.status(200).json({ rewards })
}

export async function rewardAddController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const reward: Reward = req.body.reward

  const rewardCollection = collection(db, 'businesses', businessUid, 'rewards') as CollectionReference<Reward>
  await addDoc(rewardCollection, reward)
  res.status(200)
}

export async function rewardDeleteController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const rewardUid: string = req.body.rewardUid

  const rewardCollection = collection(db, 'businesses', businessUid, 'rewards') as CollectionReference<Reward>
  await deleteDoc(doc(rewardCollection, rewardUid))
  res.status(200)
}

export async function rewardGetEligibleController (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const pointsEarned: number = req.body.pointsEarned

  const rewardCollection = collection(db, 'businesses', businessUid, 'rewards') as CollectionReference<Reward>
  const eligibleDocs = await getDocs(query(rewardCollection, where('points', '<=', pointsEarned)))

  const rewards = eligibleDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  res.status(200).json({ rewards })
}
