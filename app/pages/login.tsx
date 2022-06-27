import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth'

// typescript interface for form input
interface Inputs {
    email: string
    password: string
}

function Login () {
  const router = useRouter()

  // react state to check whether user clicked login
  const [login, setLogin] = useState(false)

  const { signIn } = useAuth()

  // form hooks
  const {
    register,
    handleSubmit,
    // TODO: Fix this unused variable
    // eslint-disable-next-line no-unused-vars
    watch,
    // TODO: Fix this unused variable
    // eslint-disable-next-line no-unused-vars
    formState: { errors }
  } = useForm<Inputs>()

  // authenticate if user signed in
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (login) {
      await signIn(email, password)
    }
  }

  // HTML elements of the page
  // handleSubmit validates input, register gets data

  return (
    <div className="home-div">
      <Head>
        <title>Login Page</title>
        <link rel="icon" href="coffee-icon.png" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 default-div rounded-lg p-4 min-w-fit">
        <h1 className="font-bold text-center text-6xl text-dark-nonblack p-2">Sign In</h1>

        <div className="flex flex-col gap-2 w-96 p-2 darker-div">
          <label>
            <input type="email"
              placeholder="Email"
              className="input"
              {...register('email', { required: true })}/>
          </label>
          <label>
            <input type="password"
              placeholder="Password"
              className="input"
              {...register('password', { required: true })}/>
          </label>
        </div>

        <button onClick={() => setLogin(true)} className="general-button">
          Submit
        </button>

        <p className="text-center text-dark-nonblack font-bold text-xl">
          Haven&apos;t made an account yet?
        </p>

        <div className="grid gap-4 grid-cols-2 place-content-center">
          <button onClick={() => router.push('/customer-signup')} className="general-button">
            User Sign Up
          </button>

          <button onClick={() => {
            router.push('/business-signup')
          }} className="general-button">
            Business Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
