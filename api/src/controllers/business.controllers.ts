import { Request, Response } from "express"
import { db } from '../plugins/firebase'
// import { Businesses } from "src/models/FirestoreCollections"
import { doc, getDoc, setDoc} from "@firebase/firestore"

export async function businessQRScanController(_req: Request, res: Response) {
    var discountString

    const user_business_id: String = _req.body.user_business_id
    const id_array = user_business_id.split('-')
    if (id_array[0] && id_array[1]) {
        console.log(id_array[0])
        const busDoc = doc(db, "businesses", id_array[0])
        const custsDocRef = doc(busDoc, "customers_visited", id_array[1])
        console.log(id_array[1])
        const custsDocSnap = await getDoc(custsDocRef)
        console.log("finished awaiting")
        if (custsDocSnap.exists()) {
            discountString = "This user has already visited your business"
        } else {
            await setDoc(custsDocRef, {})
            discountString = "This user is new! Treat them to a discount"
        }
    } else {
        discountString = "Invalid QR-code"
    }

    res.status(200).json({ discount: discountString})
}