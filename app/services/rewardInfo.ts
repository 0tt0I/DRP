import { Reward } from '../types/FirestoreCollections'

export async function getRewardInfo (businessUid: string, rewardUid: string) {
  const res = await fetch('/api/reward/get-reward-info', {
    method: 'POST',
    body: JSON.stringify({ businessUid, rewardUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getAllRewards (businessUid: string) {
  const res = await fetch('/api/reward/get-all-rewards', {
    method: 'POST',
    body: JSON.stringify({ businessUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function addReward (businessUid: string, reward: Reward): Promise<void> {
  const res = await fetch('/api/reward/add-reward', {
    method: 'POST',
    body: JSON.stringify({ businessUid, reward }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function deleteReward (businessUid: string, rewardUid: string): Promise<void> {
  const res = await fetch('/api/reward/delete-reward', {
    method: 'POST',
    body: JSON.stringify({ businessUid, rewardUid }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function getEligibleRewards (businessUid: string, pointsEarned: number) {
  const res = await fetch('/api/reward/get-eligible-rewards', {
    method: 'POST',
    body: JSON.stringify({ businessUid, pointsEarned }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}
