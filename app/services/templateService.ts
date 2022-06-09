export async function getApi () {
  const res = await fetch('http://localhost:3000/api')
  return await res.json()
}
