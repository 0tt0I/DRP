export async function getApi () {
  const res = await fetch('http://localhost:3080/api')
  return await res.json()
}
