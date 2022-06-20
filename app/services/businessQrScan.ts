export async function checkNewCustomer (businessUid: String, redeemerUid: String, discountUid: String, useruid: String) {
  const dict = {
    businessUid,
    redeemerUid,
    discountUid,
    businessLoggedIn: useruid
  }
  const res = await fetch('/api/business/qr-scan', {
    method: 'POST',
    body: JSON.stringify(dict),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}

export async function awardPoints (points: Number, promoterUid: string, businessUid: string, redeemerUid: string) {
  const dict = {
    points,
    promoterUid,
    businessUid,
    redeemerUid
  }
  const res = await fetch('/api/business/award-points', {
    method: 'POST',
    body: JSON.stringify(dict),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}
