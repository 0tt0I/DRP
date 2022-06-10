import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { getApi } from '../services/templateService'

const Home: NextPage = () => {
  const [name, setName] = useState('')

  useEffect(() => {
    const f = async () => { setName((await getApi()).name) }
    f()
  }, [])

  return (
    <h1>
      Welcome {name}, to <a href="https://nextjs.org">Next.js!</a>
    </h1>
  )
}

export default Home
