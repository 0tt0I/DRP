import Head from 'next/head'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth'

// typescript interface for form input
interface Inputs {
    email: string
    password: string
}

function Login () {
  // react state to check whether user clicked login
  const [login, setLogin] = useState(false)

  // react state for whether the sign up is for a business
  const [isBusiness, setIsBusiness] = useState(false)

  const { signIn, signUp } = useAuth()

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
    } else {
      await signUp(email, password, isBusiness)
    }
  }

  // HTML elements of the page
  // handleSubmit validates input, register gets data

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title> Login Page</title>
        <link rel="icon" href="coffee-icon.png" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In Page</h1>
        <div>
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

        <button onClick={() => setLogin(true)}> Submit </button>

        <div>
          <button onClick={() => setLogin(false)} type="submit"> Sign Up Here </button>
        </div>
        <div>
          <button onClick={() => {
            setLogin(false)
            setIsBusiness(true)
          }
          } type="submit"> Business Sign Up </button>
        </div>
      </form>
    </div>
  )
}

export default Login
