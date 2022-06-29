import { Dialog } from '@headlessui/react'
import { GeoPoint } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Camera from '../components/Camera'
import useAuth from '../hooks/useAuth'

// typescript interface for form input
interface Inputs {
  email: string
  password: string
  longitude: number
  latitude: number
  name: string
}

export default function BusinessSignup () {
  // Current image.
  const [picOpen, setPicOpen] = useState(false)
  const [imageRef, setImageRef] = useState<string | undefined>(undefined)

  const selectedImageRef = useRef<HTMLInputElement | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

  const { businessSignUp } = useAuth()
  const router = useRouter()

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

  const signUpHandler: SubmitHandler<Inputs> = async ({ email, password, name, longitude, latitude }) => {
    // sign up as business
    businessSignUp(email, password, { name, location: new GeoPoint(longitude, latitude) }).then((_) =>
      router.push('/business/home')
    )
  }

  return (
    <div className="home-div">
      <Dialog open={picOpen} onClose={() => setPicOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
          <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
            <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
            Business Picture
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col grow text-center">
                <p>Take a picture to advertise your business:</p>
              </div>
            </Dialog.Description>

            <div className="place-self-center">
              <Camera imageRef={setImageRef} existingRef={imageRef} constraints={{
                width: 192,
                height: 192,
                facingMode: 'user'
              }} />
            </div>

            <button className="general-button" onClick={() => {
              setPicOpen(false)
              setSelectedImage(undefined)
            }}>
              Confirm
            </button>

            <button className="general-button" onClick={() => {
              setPicOpen(false)
              setImageRef(undefined)
            }}>
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <form className="home-subdiv-l" onSubmit={handleSubmit(signUpHandler)}>
        <h1>Business Sign-Up</h1>
        <div className="flex flex-col gap-2 p-2 default-div">
          <h1 className="font-bold text-dark-nonblack text-center">Business Details</h1>

          <label>
            <input type="text"
              placeholder="Business Name"
              className="input"
              {...register('name', { required: true })}/>
          </label>
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
          <label>
            <input type="number"
              step="any"
              placeholder="Longitude"
              className="input"
              {...register('longitude', { required: true })}/>
          </label>
          <label>
            <input type="number"
              step="any"
              placeholder="Latitude"
              className="input"
              {...register('latitude', { required: true })}/>
          </label>
        </div>

        <div className="flex flex-col gap-2 p-2 default-div">
          <h1 className="font-bold text-dark-nonblack text-center">Business Image</h1>

          <div className="flex flex-row gap-2 p-2">
            <input type="file" id="file" ref={selectedImageRef} style={{ display: 'none' }} onChange={e => {
              const f = e.target.files?.item(0)
              setSelectedImage(URL.createObjectURL(f!))
              setImageRef(undefined)
            }} />

            {imageRef === undefined
              ? ( // Put the input in a div...
                <div className="flex w-48 h-48 darker-div place-self-center items-center justify-center">
                  {selectedImageRef.current !== null && selectedImage && (
                    <img src={selectedImage} className="object-scale-down rounded-lg" />
                  )}
                </div>)
              : <img src={imageRef} className="w-48 h-48 rounded-lg place-self-center" />}

            <div className="flex flex-col gap-2 grow">
              <button className="general-button" onClick={() => setPicOpen(true)}>
                Open Camera
              </button>

              <button className="general-button" onClick={() => selectedImageRef.current?.click()}>
                Upload Image
              </button>

              <button className="general-button" onClick={() => {
                setSelectedImage(undefined)
                setImageRef(undefined)
              }}>
                Clear Image
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={() => router.push('/login')} className="general-button">
            Back to Login
          </button>

          <button
            type='submit' className="general-button">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
