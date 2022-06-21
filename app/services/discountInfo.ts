import { Discount } from '../types/FirestoreCollections'

export async function getDiscountInfo (businessUid: string, discountUid: string) {
  const res = await fetch('/api/discount/get-discount-info', {
    method: 'POST',
    body: JSON.stringify({ businessUid, discountUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getAllDiscounts (businessUid: string) {
  const res = await fetch('/api/discount/get-all-discounts', {
    method: 'POST',
    body: JSON.stringify({ businessUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function addDiscount (businessUid: string, discount: Discount): Promise<void> {
  const res = await fetch('/api/discount/add-discount', {
    method: 'POST',
    body: JSON.stringify({ businessUid, discount }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function deleteDiscount (businessUid: string, discountUid: string): Promise<void> {
  const res = await fetch('/api/discount/delete-discount', {
    method: 'POST',
    body: JSON.stringify({ businessUid, discountUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getEligibleDiscounts (businessUid: string, pointsEarned: number) {
  const res = await fetch('/api/discount/get-eligible-discounts', {
    method: 'POST',
    body: JSON.stringify({ businessUid, pointsEarned }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}
