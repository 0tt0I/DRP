import { addDoc, getDocs, updateDoc } from '@firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import { auth, createCollection, db, storage } from '../firebase'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import { collection, doc } from 'firebase/firestore'
import { Referral } from '../types/FirestoreCollections'
import { Combobox } from '@headlessui/react'
import { createHash } from 'crypto'

export default function Referrals () {
  const router = useRouter()

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newPlace, setNewPlace] = useState('')
  const [newReview, setNewReview] = useState('')

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')

  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState('')

  const createReferral = async () => {
    if (newPlace === '' || newReview === '' || imageRef === '') {
      // set error message to be displayed
      setInputValidation('Fill in all fields and take a picture!')
    } else {
      // set input validation to success
      setInputValidation('Success!')

      // get current time and format correctly
      const current = new Date()
      const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

      // get user email (shouldn't be null as user already logged in)
      const userEmail = auth.currentUser!.email

      // null check
      if (userEmail) {
        // add doc to firestore
        const docRef = await addDoc(collectionsRef,
          { place: newPlace, review: newReview, date, userEmail, image: '' })

        // get the image storage bucket from firebase storage
        const imageStorage = ref(storage, `referrals/${docRef.id}/image`)

        // upload image, then update firestore document with image's download URL
        await uploadString(imageStorage, imageRef, 'data_url').then(
          async snapshot => {
            const downloadURL = await getDownloadURL(imageStorage)

            await updateDoc(doc(db, 'referrals', docRef.id), {
              image: downloadURL
            })
          }
        )

        // set taken image to empty again
        setImageRef('')
      }
    }
  }

  // api call to firestore to run on page load
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(collectionsRef)

      // get relevant information from document
      setReferrals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  // state for list of business names
  const [businesses, setBusinesses] = useState<string[]>([])

  // get all business docs
  // TODO: Fix this unused variable
  // eslint-disable-next-line no-unused-vars
  const _query = getDocs(collection(db, 'businesses')).then((snapshot) => {
    const nameList: string[] = []

    snapshot.forEach((doc) => {
      // console.log(doc.data().name)
      nameList.push(doc.data().name)
    })

    setBusinesses(nameList)
  })

  // states for dropdown menu
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0])

  // updating dropdown menu as user types
  const filteredBusinesses = (
    newPlace === ''
      ? businesses
      : (businesses).filter((business) => {
        return business.toLowerCase().includes(newPlace.toLowerCase())
      })
  )

  // display each referral from state, use combobox for dropdown menu
  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <div className="bg-violet-300 rounded-lg flex flex-col p-4 gap-2">
        <h2 className="font-bold text-center text-4xl text-violet-800">
          Make a Referral
        </h2>

        <div className="gap-2 flex flex-col bg-violet-400 p-2 rounded-lg">
          <label>
            <Combobox value={selectedBusiness} onChange={setSelectedBusiness}>
              <Combobox.Input onChange={(event) => setNewPlace(event.target.value)} className="input" placeholder="Location Name: " />
              <Combobox.Options>
                {filteredBusinesses.map((business) => (
                  <Combobox.Option key={business} value={business}>
                    {business}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </label>

          <label>
            <input
              placeholder="Review: "
              className="input"
              onChange={(event) => setNewReview(event.target.value)}/>
          </label>
        </div>

        <Camera imageRef={setImageRef}/>

        <div className="place-self-center">
          <button onClick={createReferral} className="general-button">ADD REFERRAL</button>
        </div>

        <h1 className="bg-white font-bold text-violet-600 p-2 rounded-lg text-center">{inputValidation}</h1>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-lg bg-violet-200">
        <h1 className="font-bold text-center text-4xl text-violet-800">Current Referrals</h1>
        {referrals.map(ReferralEntry)}
      </div>

      <button onClick={() => router.push('/')} className="general-button">
        Back To Home
      </button>
    </div>
  )
}

function ReferralEntry (ref: Referral) {
  return (
    <div
      key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
      className="flex flex-col gap-4 place-content-center p-4 bg-violet-300 rounded-lg max-w-fit">
      <div className="flex flex-row gap-4 place-content-start">
        <img src={ref.image} className="object-scale-down h-60 place-self-center rounded-lg" />

        <div className="grid grid-rows-6 grid-flow-col-dense place-content-center gap-2">
          <h1 className="font-bold text-violet-900">PLACE</h1>
          <h1 className="font-bold text-violet-900 w-32">USER EMAIL</h1>
          <h1 className="font-bold text-violet-900">DATE</h1>
          <h1 className="font-bold text-violet-900 row-span-3">REVIEW</h1>
          <p>{ref.place}</p>
          <p>{ref.userEmail}</p>
          <p>{ref.date}</p>
          <p className="row-span-3 w-60">{ref.review}</p>
        </div>
      </div>

      <div className="general-button">
        USE REFERRAL
      </div>
    </div>
  )
}
