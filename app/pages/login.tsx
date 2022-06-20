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
    <div className="home-div">
      <Head>
        <title>Login Page</title>
        <link rel="icon" href="coffee-icon.png" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 default-div rounded-lg p-4 min-w-max">
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

        <div className="grid gap-4 grid-cols-2 place-content-center">
          <button onClick={() => setLogin(false)} type="submit" className="general-button">
            User Sign Up
          </button>

          <button onClick={() => {
            setLogin(false)
            setIsBusiness(true)
          }} type="submit" className="general-button">
            Business Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
