import { useRouter } from 'next/router'


export default function Referrals() {

  const router = useRouter()

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Referrals
      </h1>
      <button onClick={() => router.push("/")}>Back To Home</button>
    </div>
    
  )
}