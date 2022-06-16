import { useRouter } from "next/router"
import useAuth from "../hooks/useAuth"

export default function Home() {

  const {logout, loading} = useAuth()
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello DRP!
      </h1>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <button onClick={() => router.push("/referrals")}>Referrals</button>
      </div>
    </div>
    
  )
}