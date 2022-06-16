export async function checkNewCustomer (qrString: String, useruid: String) {
  const dict = {
    qrString,
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
