export async function getApi () {
  const res = await fetch('/api')
  return await res.json()
}
