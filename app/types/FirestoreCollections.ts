interface Referral {
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
    name: string,
}

interface Discount {
    id: string
    description: string,
    points: number
    id: string
}

interface BusinessPoints {
    pointsEarned: number
}

export type { Referral, Businesses, Discount, BusinessPoints }
