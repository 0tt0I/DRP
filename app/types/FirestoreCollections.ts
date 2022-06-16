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
    description: string,
    points: number
}

export type { Referral, Businesses, Discount }
