import { Request, Response } from 'express'
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc } from '@firebase/firestore'
import { getDocs, updateDoc, collection, QueryDocumentSnapshot } from 'firebase/firestore'
import { Discount } from 'src/models/FirestoreCollections'

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
      // this document will be filled in if the business confirms
      // they have redeemed the discount
    }

    if (newCustomer) {
      const discountDocRef = doc(businessDocRef, 'discounts', discountUid)
      const discountDocSnap = await getDoc(discountDocRef)
      if (discountDocSnap.exists()) {
        discount = { ...discountDocSnap.data(), id: discountDocSnap.id }
      }
    }
  }

  res.status(200).json({ newCustomer, businessValid, discount })
}

export async function businessAwardPointsController (req: Request, res: Response) {
  const redeemerUid: string = req.body.redeemerUid
  const promoterUid: string = req.body.promoterUid
  const points: Number = req.body.points
  const businessUid: string = req.body.businessUid

  if (!(promoterUid && points && businessUid)) {
    // Feedback not currently required by frontend
    res.sendStatus(200)
    return
  }

  const businessDocRef = doc(db, 'businesses', businessUid)
  const redeemerDocRef = doc(businessDocRef, 'customers_visited', redeemerUid)
  await setDoc(redeemerDocRef, {})

  const promoterDocRef = doc(db, 'customers', promoterUid)
  const pointsDocRef = doc(promoterDocRef, 'businesses', businessUid)
  const pointsDocSnap = await getDoc(pointsDocRef)

  const prevPoints = pointsDocSnap.exists() ? pointsDocSnap.data().pointsEarned : 0

  await updateDoc(pointsDocRef, { pointsEarned: prevPoints + points })

  res.sendStatus(200)
}

export async function businessGetNameAndDiscount (req: Request, res: Response) {
  const businessUid: string = req.body.businessUid
  const businessDocRef = doc(db, 'businesses', businessUid)
  const businessDoc = await getDoc(businessDocRef)

  if (businessDoc.exists()) {
    const name: string = businessDoc.get('name')
    const discounts = (await getDocs(collection(businessDocRef, 'discounts'))).docs as QueryDocumentSnapshot<Discount>[]
    const discount: string = discounts[0] ? discounts[0].data().description : ''
    res.status(200).json({ name, discount })
  } else {
    res.status(200).json({ name: '', discount: '' })
  }
}
