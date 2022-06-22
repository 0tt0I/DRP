import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Reward } from '../../types/FirestoreCollections'
import { createHash } from 'crypto'
import { addReward, getAllRewards, deleteReward } from '../../services/rewardInfo'
import { getUid } from '../../services/authInfo'

export default function SetRewards () {
  const router = useRouter()

  // modal state for popup and info for qr-scan
  const [inputOpen, setInputOpen] = useState(false)

  // state for description inpu
  const [newDescription, setNewDescription] = useState('')
  // state for points input
  const [newPoints, setNewPoints] = useState(0)
  // state for Reward collection ref

  const businessUid = useRef(getUid())

  // set state for referrals
  const [rewards, setRewards] = useState<Reward[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  async function getRewardList () {
    const jsonResponse = await getAllRewards(businessUid.current)
    setRewards([...jsonResponse.rewards])
  }

  function refreshPage () {
    window.location.reload()
  }

  useEffect(() => {
    if (initialLoad) {
      getRewardList()
      setInitialLoad(false)
    }
  }, [])

  const createReward = async () => {
    const newReward: Reward = {
      description: newDescription,
      points: newPoints
    }

    await addReward(businessUid.current, newReward)
    setRewards((oldRewards) => oldRewards.concat([newReward]))
  }

  const removeReward = async (rewardUid: string) => {
    await deleteReward(businessUid.current, rewardUid)
    getRewardList()
  }

  return (
    <div className="home-div">
      <div className="home-subdiv-l">
        <Dialog open={inputOpen} onClose={() => setInputOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title as="h3" className="font-bold text-center text-4xl text-dark-nonblack">
              Add Reward
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex flex-col grow text-center">
                  <p>Description: How this will appear to customers.</p>
                  <br></br>
                  <p>Points: The number of points needed to be spent to redeem this reward.</p>
                </div>
              </Dialog.Description>

              <div className="flex flex-col default-div p-2 gap-2 grow">
                <label>
                  <input
                    placeholder="Description: "
                    className="input"
                    onChange={(event) => setNewDescription(event.target.value)}/>
                </label>
                <label>
                  <input
                    placeholder="Points: "
                    className="input"
                    type="tel"
                    onChange={(event) => {
                      setNewPoints(Number(event.target.value))
                    }}/>
                </label>
              </div>

              <button className="general-button" onClick={() => {
                createReward()
                setInputOpen(false)
                refreshPage()
                // TODO: find better way to ensure new Reward appears in list
              }}>
                Submit
              </button>
              <button className="general-button" onClick={() => setInputOpen(false)}>
                Cancel
              </button>

            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="flex flex-col gap-4 p-4">
          <h2 className="font-bold text-center text-4xl text-dark-nonblack">Set Rewards</h2>
          <p>These are the &apos;loyalty card&apos; rewards available to returning customers.</p>

          {rewards.length > 0
            ? rewards.map(RewardEntry)
            : <p className="text-warning text-center text-2xl p-8">There are no active Rewards.</p>}

          <button className="general-button" onClick={() => setInputOpen(true)}>  Add </button>
          <button onClick={() => router.push('/business/your-business')} className="general-button">
            Back to Your Business
          </button>
        </div>
      </div>
    </div>
  )

  function RewardEntry (ref: Reward) {
    return (
      <div
        key={createHash('sha256').update(JSON.stringify(ref)).digest('hex').toString()}
        className="flex flex-col gap-4 place-content-center p-4 default-div rounded-lg min-w-max grow">
        <div className="flex flex-col sm:flex-row gap-4 place-content-start min-w-max grow">
          <div className="ref-info grid grid-cols-3 grid-flow-row-dense place-content-center gap-2 grow">
            <h1 className="font-bold text-dark-nonblack">Description: </h1>
            <p className="col-span-2">{ref.description}</p>

            <h1 className="font-bold text-dark-nonblack w-16 sm:w-32">Points Worth: </h1>
            <p className="col-span-2">{ref.points}</p>
          </div>

          <div className='place-self-end sm:place-self-center'>
            <button className='general-button' onClick={() => {
              removeReward(ref.id ? ref.id : '')
              refreshPage()
              // TODO: find better way to ensure list is updated
            }}>Delete</button>
          </div>
        </div>
      </div>
    )
  }
}
