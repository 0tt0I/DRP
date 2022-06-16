interface Referral {
    date: string,
    place: string,
    review: string,
    userEmail: string,
    image: string,
    discount: string,
    businessUid: string
}

interface Businesses {
    name: string,
}

export type { Referral, Businesses }
