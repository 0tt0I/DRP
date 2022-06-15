import React from 'react'
import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'

export default function Home () {
  const { logout, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return null
  }

  return (
    <div className="relative grid grid-cols-1 grid-rows-1 h-screen w-screen items-center justify-center">
      <div className="place-self-center flex flex-col gap-4 bg-violet-300 p-4 rounded-lg">
        <h1 className="text-3xl text-violet-900 font-bold">
          What would you like to do?
        </h1>

        <div className="flex flex-row gap-4 place-content-center">
          <button onClick={logout} className="general-button">
            Log Out
          </button>

          <button onClick={() => router.push('/referrals')} className="general-button">
            See Referrals
          </button>
        </div>
      </div>
    </div>
  )
}
