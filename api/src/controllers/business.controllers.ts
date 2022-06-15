import { Request, Response } from "express"
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc} from "@firebase/firestore"

export async function businessQRScanController(_req: Request, res: Response) {
    var newCust

    const user_business_id: String = _req.body.user_business_id
    const business_logged_in: String = _req.body.business_logged_in
    const id_array = user_business_id.split('-')
    if (id_array[0] && id_array[1]) {
        if (id_array[0] != business_logged_in) {
            newCust = 2
        } else {
            const busDoc = doc(db, "businesses", id_array[0])
            const custsDocRef = doc(busDoc, "customers_visited", id_array[1])
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

    res.status(200).json({ newUser: newCust})
}