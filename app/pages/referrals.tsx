import { addDoc, getDocs, updateDoc } from '@firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Camera from '../components/Camera'
import { auth, createCollection, db, storage } from '../firebase'
import { ref, getDownloadURL, uploadString } from "@firebase/storage"
import { doc } from 'firebase/firestore'
import Referral from '../types/Referral'

// type for document - todo!() move into types folder?


export default function Referrals () {
  const router = useRouter()

  // set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([])

  // get collections reference from firestore
  const collectionsRef = createCollection<Referral>('referrals')

  // states for input fields
  const [newPlace, setNewPlace] = useState('')
  const [newReview, setNewReview] = useState('')

  //state for input field error
  const [inputValidation, setInputValidation] = useState('')


  // imageRef state from Camera component
  const [imageRef, setImageRef] = useState('');

  const createReferral = async () => {

    if (newPlace === '' || newReview === '' || imageRef === '') {

      //set error message to be displayed   
      setInputValidation("Fill in all fields and take a picture!")
   
    } else {
      // set input validation back to empty
      setInputValidation("")

      // get current time and format correctly
      const current = new Date()
      const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

      // get user email (shouldn't be null as user already logged in)
      const userEmail = auth.currentUser!.email

      //null check
      if (userEmail) {
        // add doc to firestore
        const docRef = await addDoc(collectionsRef, 
          { place: newPlace, review: newReview, date, userEmail, image: ""})

        // get the image storage bucket from firebase storage
        const imageStorage = ref(storage, `referrals/${docRef.id}/image`)


        //upload image, then update firestore document with image's download URL
        await uploadString(imageStorage, imageRef, 'data_url').then(
          async snapshot => {
            const downloadURL = await getDownloadURL(imageStorage);
            
            await updateDoc(doc(db, "referrals", docRef.id), {
              image: downloadURL
            })
          }
        )

        //set taken image to empty again
        setImageRef("")
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

  // display each referral from state
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Referrals
      </h1>

      <input
        placeholder="Place: "
        onChange={(event) => setNewPlace(event.target.value)}/>
      <input
        placeholder="Review: "
        onChange={(event) => setNewReview(event.target.value)}/>
      <Camera imageRef={setImageRef}/> 

      <button onClick={createReferral}> Add Referral </button>
      <h1>{inputValidation}</h1>

      <div>
        {referrals.map((ref) => {
          return (
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
