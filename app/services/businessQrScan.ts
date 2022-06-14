export async function checkNewCustomer (qrString: String) {
    const res = await fetch('/api/business/qr-scan', {
        method: "POST",
        body: JSON.stringify({user_business_id: qrString})
    })
    return await res.json()
}