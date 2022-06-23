import { doc, getDoc, updateDoc, collection, CollectionReference, getDocs, query, where, addDoc } from '@firebase/firestore'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import { Request, Response } from 'express'
import { deleteDoc, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { deleteObject } from 'firebase/storage'
import { RedeemableDiscount, Referral, VisitedBusiness, Business } from '../models/FirestoreCollections'
import { db, storage } from '../plugins/firebase'
import { Location, locationFromGeoPoint } from '../models/Location'
import { getDistance } from 'geolib'

export async function customerGetPointsController (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid
  const businessUid: string = req.body.businessUid

  const docRef = doc(db, 'customers', customerUid, 'businesses', businessUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const pointsEarnedData = docSnap.data().pointsEarned
    const pointsEarned = pointsEarnedData || 0
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

export async function customerGetOtherReferrals (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid
  const customerLocation: Location = req.body.customerLocation
  const maxReferrals: number = req.body.maxReferrals

  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>
  const referralsData = await getDocs(
    query(collectionsRef, where('customerUid', '!=', customerUid)))

  const businessesReference = await getDocs(collection(db, 'businesses')) as QuerySnapshot<Business>
  const businesses: Business[] = businessesReference.docs.map((bus) => ({
    ...bus.data(),
    id: bus.id
  }))

  // Function to get the location of the business associated with a referrals
  const getLocationOrDefault = (referral: QueryDocumentSnapshot<Referral>) => {
    const business = businesses.find((bus) => bus.id === referral.data().businessUid)

    return business
      ? locationFromGeoPoint(business.location)
      : { longitude: -1, latitude: -1 }
  }

  let referrals = referralsData.docs.map(referral => {
    const businessLocation = getLocationOrDefault(referral)
    return ({
      ...referral.data(),
      id: referral.id,
      // Distance accurate to 100 metres, stored in kilometres
      distance: getDistance(customerLocation, businessLocation, 100) / 1000
    })
  })

  // Order referrals by distance ascending
  referrals.sort(({ distance: a }, { distance: b }) => a - b)

  // Truncate the referrals to give only the N closest results
  referrals = referrals.slice(0, Math.min(referrals.length, maxReferrals))

  res.status(200).json({ referrals })
}

// wip: forEach loop doesn't finish before the response is sent
export async function customerGetUserDiscounts (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid
  const visitedBusinessCollection = collection(db, 'customers', customerUid, 'businesses')

  const acc: RedeemableDiscount[] = []

  const querySnapshot = await getDocs(visitedBusinessCollection)

  for (const business of querySnapshot.docs) {
    const docPoints = business.data().pointsEarned
    const docSnap = await getDoc(doc(db, 'businesses', business.id))

    if (docSnap.exists()) {
      const currentDiscountDocs = await getDocs(query(collection(db, 'businesses', business.id, 'discounts'), where('points', '<=', docPoints)))
      currentDiscountDocs.forEach(async (discount) => {
        const data = discount.data()
        const redeemable: RedeemableDiscount = { pointsEarned: docPoints, pointsNeeded: data.points, description: data.description, discountUid: discount.id, place: docSnap.data().name }
        acc.push(redeemable)
      })
    } else {
      // error handling - should never happen
    }
  }

  res.status(200).json({ discounts: acc })
}

export async function customerAddReferral (req: Request, res: Response) {
  const referral: Referral = req.body.referral
  const imageRef: string = req.body.imageRef

  const collectionsRef = collection(db, 'referrals') as CollectionReference<Referral>

  const oldReferrals = await getDocs(query(collectionsRef,
    where('customerUid', '==', referral.customerUid),
    where('businessUid', '==', referral.businessUid)))

  if (oldReferrals.docs[0]) {
    const oldReferralRef = oldReferrals.docs[0]
    const oldPhoto = ref(storage, oldReferralRef.data().image)
    await deleteObject(oldPhoto)
    await deleteDoc(doc(collectionsRef, oldReferralRef.id))
  }

  // add doc to firestore
  const docRef = await addDoc(collectionsRef, referral)

  // get the image storage bucket from firebase storage
  const imageStorage = ref(storage, `referrals/${docRef.id}/image`)

  // upload image, then update firestore document with image's download URL
  await uploadString(imageStorage, imageRef, 'data_url').then(
    async _snapshot => {
      const downloadURL = await getDownloadURL(imageStorage)

      await updateDoc(doc(db, 'referrals', docRef.id), {
        image: downloadURL
      })
    }
  )

  const customerRef = doc(db, 'customers', referral.customerUid)
  await updateDoc(doc(customerRef, 'businesses', referral.businessUid), { })

  res.status(200)
}

export async function customerGetVisitedBusinesses (req: Request, res: Response) {
  const customerUid: string = req.body.customerUid

  const acc: VisitedBusiness[] = []

  const collectionsRef = collection(db, 'customers', customerUid, 'businesses')
  const querySnapshot = await getDocs(collectionsRef)

  const referrals = (await getDocs(query(collection(db, 'referrals'),
    where('customerUid', '==', customerUid)))).docs as QueryDocumentSnapshot<Referral>[]

  // get relevant information from document
  for (const business of querySnapshot.docs) {
    const docSnap = await getDoc(doc(db, 'businesses', business.id))

    const referral = referrals.find(referral => referral.data().businessUid === business.id)?.data()

    if (docSnap.exists()) {
      acc.push({ name: docSnap.data().name, id: business.id, pointsEarned: business.data().pointsEarned, referral })
    }
  }

  res.status(200).json({ businesses: acc })
}
