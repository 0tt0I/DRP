import { Referral } from '../types/FirestoreCollections'

export async function getPointsEarned (customerUid: string, businessUid: string) {
  const res = await fetch('/api/customer/get-points', {
    method: 'POST',
    body: JSON.stringify({ customerUid, businessUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function updatePointsEarned (customerUid: string, businessUid: string, newPoints: number): Promise<void> {
  const res = await fetch('/api/customer/update-points', {
    method: 'POST',
    body: JSON.stringify({ customerUid, businessUid, newPoints }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getUserReferrals (customerUid: string) {
  const res = await fetch('/api/customer/get-user-referrals', {
    method: 'POST',
    body: JSON.stringify({ customerUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getOtherReferrals (customerUid: string) {
  const res = await fetch('/api/customer/get-other-referrals', {
    method: 'POST',
    body: JSON.stringify({ customerUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getUserDiscounts (customerUid: string) {
  const res = await fetch('/api/customer/get-user-discounts', {
    method: 'POST',
    body: JSON.stringify({ customerUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function addReferral (referral: Referral, imageRef: string): Promise<void> {
  const res = await fetch('/api/customer/update-points', {
    method: 'POST',
    body: JSON.stringify({ referral, imageRef }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}
