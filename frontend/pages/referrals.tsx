import { collection, getDocs } from '@firebase/firestore';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { createCollection } from '../firebase';

//type for document - todo!() move into types folder?
interface Referral {
  date: string,
  place: string,
  referral: string,
  userEmail: string,
}

export default function Referrals() {

  const router = useRouter()

  //set state for referrals
  const [referrals, setReferrals] = useState<Referral[]>([]);

  //get collections reference from firestore
  const collectionsRef = createCollection<Referral>("referrals");

  //api call to firestore to run on page load
  useEffect(() => {

    const getUsers = async () => {
      const data = await getDocs(collectionsRef);

      //get relevant information from document
      setReferrals(data.docs.map( (doc) => ({...doc.data(), id: doc.id}) ));
    };

    getUsers();

  }, [])

  //display each referral from state
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Referrals
      </h1>

      <input placeholder="Place: " />
      <input placeholder="Referral: " />
      <button> Add Referral </button>
      <div>
        {referrals.map((ref) => {
          return (
            <div>
              {" "}
              <h1>Place: {ref.place}</h1>
              <h1>Referral: {ref.referral}</h1>
              <h1>Date: {ref.date}</h1>
              <h1>User Email: {ref.userEmail}</h1>
            </div>
          )
        })}
      </div>
      <button onClick={() => router.push("/")}>Back To Home</button>
    </div>
    
  )
}