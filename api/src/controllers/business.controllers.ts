import { Request, Response } from 'express'
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc } from '@firebase/firestore'

export async function businessQRScanController (_req: Request, res: Response) {
  let newCust

  const userBusinessId: String = _req.body.userBusinessId
  const businessLoggedIn: String = _req.body.businessLoggedIn
  const idArray = userBusinessId.split('-')
  if (idArray[0] && idArray[1]) {
    if (idArray[0] !== businessLoggedIn) {
      newCust = 2
    } else {
      const busDoc = doc(db, 'businesses', idArray[0])
      const custsDocRef = doc(busDoc, 'customers_visited', idArray[1])
      const custsDocSnap = await getDoc(custsDocRef)
      if (custsDocSnap.exists()) {
        newCust = 0
      } else {
        await setDoc(custsDocRef, {})
        newCust = 1
      }
    }
  } else {
    newCust = -1
  }

  res.status(200).json({ newUser: newCust })
}
