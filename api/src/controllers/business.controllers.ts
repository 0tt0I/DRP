import { Request, Response } from 'express'
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc } from '@firebase/firestore'

export async function businessQRScanController (req: Request, res: Response) {
  let newCustomer

  const userBusinessId: String = req.body.userBusinessId
  const businessLoggedIn: String = req.body.businessLoggedIn
  console.log(userBusinessId)
  const [businessUid, customerUid] = userBusinessId.split('-')

  // both uids non-empty
  // qrString valid
  const qrValid = businessUid && customerUid

  // qr code relates to logged in business
  const businessValid = qrValid && (businessUid !== businessLoggedIn)
  if (businessValid) {
    const businessDocRef = doc(db, 'businesses', businessUid)
    const customerDocRef = doc(businessDocRef, 'customers_visited', customerUid)
    const customerDocSnap = await getDoc(customerDocRef)
    if (customerDocSnap.exists()) {
      newCustomer = false
    } else {
      await setDoc(customerDocRef, {})
      newCustomer = true
    }
  }

  res.status(200).json({ newCustomer, qrValid, businessValid })
}
