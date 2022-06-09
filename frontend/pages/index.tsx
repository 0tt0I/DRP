import useAuth from "../hooks/useAuth"

export default function Home() {

  const {logout, loading} = useAuth()

  if (loading) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello DRP!
      </h1>
      <button onClick={logout}>Logout</button>
    </div>
    
  )
}