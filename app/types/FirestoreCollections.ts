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
}

interface Businesses {
    id?: string
    name: string,
}

interface Discount {
    id?: string
    description: string,
    points: number
}

interface BusinessPoints {
    pointsEarned: number
}

interface RedeemableDiscount {
    pointsEarned: number,
    pointsNeeded: number,
    description: string,
    discountUid: string,
    place: string
  }

export type { Referral, Businesses, Discount, BusinessPoints, RedeemableDiscount }
