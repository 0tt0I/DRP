import { GeoPoint } from 'firebase/firestore'

interface Referral {
    id?: string
    date: string,
    place: string,
    review: string,
    userEmail: string,
    image: string,
    discount: string,
    businessUid: string,
    customerUid: string,
    distance?: number,
}

interface Business {
    id?: string
    name: string
    location: GeoPoint
}

interface Discount {
    id?: string
    description: string,
    points: number
}

interface Reward {
    id?: string
    description: string,
    points: number
}

interface VisitedBusiness {
    id?: string
    name: string,
    pointsEarned: number
    referral?: Referral
}

interface RedeemableDiscount {
    pointsEarned: number,
    pointsNeeded: number,
    description: string,
    discountUid: string,
    place: string
  }

export type { Referral, Business, Discount, VisitedBusiness, RedeemableDiscount, Reward }
