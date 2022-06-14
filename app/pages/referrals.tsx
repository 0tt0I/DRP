import { addDoc, getDocs, updateDoc } from '@firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import { auth, createCollection, db, isBusiness, storage } from '../firebase'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import { collection, doc } from 'firebase/firestore'
import { Referral } from '../types/FirestoreCollections'
import { Combobox } from '@headlessui/react'

export default function Referrals () {

  const router = useRouter()

  if (isBusiness()) {
    router.push('/business-home')
  }

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newPlace, setNewPlace] = useState('')
  const [newReview, setNewReview] = useState('')

  // state for input field error
  const [inputValidation, setInputValidation] = useState('')

  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState('')

  // state for list of business names
  const [businesses, setBusinesses] = useState<string[]>([])

  const createReferral = async () => {
    if (newPlace === '' || newReview === '' || imageRef === '') {
      // set error message to be displayed
      setInputValidation('Fill in all fields and take a picture!')
    } else {
      // set input validation back to empty
      setInputValidation('')

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

    // get all business docs
    // TODO: Fix this unused variable
    // eslint-disable-next-line no-unused-vars

    getDocs(collection(db, 'businesses')).then((snapshot) => {
      const nameList: string[] = []
  
      snapshot.forEach((doc) => {
        console.log(doc.data().name)
        nameList.push(doc.data().name)
      })
  
      setBusinesses(nameList)
    })


  }, [])

  

  
  

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
    <div>
      <h1 className="text-3xl font-bold underline">
        Referrals
      </h1>

      <Combobox value={selectedBusiness} onChange={setSelectedBusiness}>
        <Combobox.Input onChange={(event) => setNewPlace(event.target.value)} />
        <Combobox.Options>
          {filteredBusinesses.map((business) => (
            <Combobox.Option key={business} value={business}>
              {business}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>

      <input
        placeholder="Review: "
        onChange={(event) => setNewReview(event.target.value)}/>
      <Camera imageRef={setImageRef}/>

      <button onClick={createReferral}> Add Referral </button>
      <h1>{inputValidation}</h1>

      <div>
        {referrals.map((ref) => {
          return (
            // TODO: Fix this jsx key warning
            // eslint-disable-next-line react/jsx-key
            <div>
              <br></br>
              <h1>Place: {ref.place}</h1>
              <h1>Review: {ref.review}</h1>
              <h1>Date: {ref.date}</h1>
              <h1>User Email: {ref.userEmail}</h1>
              <img src={ref.image}/>
            </div>
          )
        })}
      </div>
      <br></br>

      <h1>{imageRef}</h1>
      <button onClick={() => router.push('/')}>Back To Home</button>
    </div>

  )
}
