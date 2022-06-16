import { Combobox } from '@headlessui/react'
import { getDoc, doc, addDoc, updateDoc, getDocs, collection } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import { auth, createCollection, db, storage } from '../firebase'
import { Referral } from '../types/FirestoreCollections'

export default function AddReferral () {
  const router = useRouter()

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newPlace, setNewPlace] = useState('')
  const [newReview, setNewReview] = useState('')

  // state for input field error
  const [inputValidation, setInputValidation] = useState('...')

  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState('')

  // state for list of business names
  const [businesses, setBusinesses] = useState<[string, string][]>([])

  // states for dropdown menu
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0])

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
        const discountStringField = (await getDoc(doc(db, 'businesses', selectedBusiness[1]))).get('new_customer_discount')
        const discountString = discountStringField || 'Ask about the discount at the till!'

        const newReferral = { place: selectedBusiness[0], review: newReview, date, userEmail, image: '', discount: discountString, businessUid: selectedBusiness[1], customerUid: auth.currentUser!.uid }

        // add doc to firestore
        const docRef = await addDoc(collectionsRef, newReferral)

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

        newReferral.image = imageRef

        // set taken image to empty again
        setImageRef('')
        router.push('/my-referrals')
      }
    }
  }

  useEffect(() => {
    const getBusinesses = async () => {
      const nameList: [string, string][] = []

      const data = await getDocs(collection(db, 'businesses'))
      data.forEach(businsessDoc => nameList.push([businsessDoc.data().name, businsessDoc.id]))

      setBusinesses(nameList)
    }

    getBusinesses()
  }, [])

  // updating dropdown menu as user types
  const filteredBusinesses = (
    newPlace === ''
      ? businesses
      : (businesses).filter((business) => {
        return business[0].toLowerCase().includes(newPlace.toLowerCase())
      })
  )

  return (
    <div className="relative flex flex-col gap-8 w-screen items-center p-4">
      <div className="bg-violet-300 rounded-lg flex flex-col p-4 gap-2">
        <h2 className="font-bold text-center text-4xl text-violet-800">
          Make a Referral
        </h2>

        <div className="gap-2 flex flex-col bg-violet-400 p-2 rounded-lg">
          <label>
            <Combobox value={selectedBusiness} onChange={setSelectedBusiness}>
              <Combobox.Input
                onChange={(event) => setNewPlace(event.target.value)}
                displayValue={(business: [string, string]) => selectedBusiness ? selectedBusiness[0] : ''}
                className="input" placeholder="Location Name: " />
              <Combobox.Options>
                {filteredBusinesses.map((business) => (
                  <Combobox.Option key={business[1]} value={business}>
                    {business[0]}
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
    </div>
  )
}
