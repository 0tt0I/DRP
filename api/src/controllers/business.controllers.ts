import { Request, Response } from 'express'
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc } from '@firebase/firestore'
import { updateDoc } from 'firebase/firestore'

export async function businessQRScanController (req: Request, res: Response) {
  let newCustomer, discount

  const businessUid: string = req.body.businessUid
  const redeemerUid: string = req.body.redeemerUid
  const discountUid: string = req.body.discountUid
  const businessLoggedIn: string = req.body.businessLoggedIn

  // qr code relates to logged in business
  const businessValid = (businessUid === businessLoggedIn)
  if (businessValid) {
    const businessDocRef = doc(db, 'businesses', businessUid)
    const customerDocRef = doc(businessDocRef, 'customers_visited', redeemerUid)
    const customerDocSnap = await getDoc(customerDocRef)
    if (customerDocSnap.exists()) {
      newCustomer = false
    } else {
      newCustomer = true
    }

    if (newCustomer) {
      const discountDocRef = doc(businessDocRef, 'discounts', discountUid)
      const discountDocSnap = await getDoc(discountDocRef)
      if (discountDocSnap.exists()) {
        discount = { ...discountDocSnap.data(), id: discountDocSnap.id }
        // set customer as old customer
        // TODO move this to when they redeem the reward
        await setDoc(customerDocRef, {})
      }
    }
  }

  res.status(200).json({ newCustomer, businessValid, discount })
}

export async function businessAwardPointsController (req: Request, res: Response) {
  const promoterUid: string = req.body.promoterUid
  const points: Number = req.body.points
  const businessUid: string = req.body.businessUid

  if (!(promoterUid && points && businessUid)) {
    // Feedback not currently required by frontend
    res.sendStatus(200)
    return
  }

  const customerDocRef = doc(db, 'customers', promoterUid)
  const pointsDocRef = doc(customerDocRef, 'businesses', businessUid)
  const pointsDocSnap = await getDoc(pointsDocRef)

  const prevPoints = pointsDocSnap.exists() ? pointsDocSnap.data().points : 0

  await updateDoc(pointsDocRef, { points: prevPoints + points })

  res.sendStatus(200)
}
