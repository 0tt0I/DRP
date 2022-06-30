import { Dialog } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Reward } from '../../types/FirestoreCollections'
import { createHash } from 'crypto'
import { addReward, getAllRewards, deleteReward } from '../../services/rewardInfo'
import { getUid } from '../../services/authInfo'
import Header from '../../components/Header'

export default function SetRewards () {
  // modal state for popup and info for qr-scan
  const [inputOpen, setInputOpen] = useState(false)

  // state for description inpu
  const [newDescription, setNewDescription] = useState('')

  // state for points input
  const [newPoints, setNewPoints] = useState(0)

  // state for Reward collection ref
  const businessUid = useRef(getUid())

  // state for validation status
  const [inputValidation, setInputValidation] = useState('')

  // set state for referrals
  const [rewards, setRewards] = useState<Reward[] | undefined>(undefined)
  const [initialLoad, setInitialLoad] = useState(true)

  async function getRewardList () {
    const jsonResponse = await getAllRewards(businessUid.current)
    setRewards([...jsonResponse.rewards])
  }

  const refreshPage = () => {
    window.location.reload()
  }

  useEffect(() => {
    if (initialLoad) {
      getRewardList()
      setInitialLoad(false)
    }
  }, [])

  const createReward = () => {
    // Fields not filled.
    if (newPoints <= 0 || newDescription === '') {
      return false
    }

    const newReward: Reward = {
      description: newDescription,
      points: newPoints
    }

    addReward(businessUid.current, newReward)
      .then(() => setRewards((oldRewards) => oldRewards!.concat([newReward])))
      .catch(console.table)

    return true
  }

  const removeReward = async (rewardUid: string) => {
    await deleteReward(businessUid.current, rewardUid)
    getRewardList()
  }

  if (rewards === undefined) {
    return <></>
  }

  return (
    <div className="home-div">
      <div className="home-subdiv-l">
        <Dialog open={inputOpen} onClose={() => null} className="relative z-50">
          <div className="fixed inset-0 flex items-center justify-center p-4 drop-shadow-lg">
            <Dialog.Panel className="w-full max-w-md overflow-hidden p-4 text-left align-middle shadow-xl transition-all flex flex-col gap-4 ultralight-div">
              <Dialog.Title>
                <Header onClick={() => setInputOpen(false)} text="Add Reward" />
              </Dialog.Title>

              <div className="flex flex-col lighter-div p-2 gap-2 grow">
                <label>
                  <input
                    placeholder="Description: Coffee on the house! "
                    className="input"
                    onChange={(event) => setNewDescription(event.target.value)}/>
                </label>
                <label>
                  <input
                    placeholder="Points: 15"
                    className="input"
                    type="tel"
                    onChange={(event) => {
                      setNewPoints(Number(event.target.value))
                    }}/>
                </label>
              </div>

              {inputValidation !== ''
                ? <p className="white-div p-2 text-dark-nonblack font-bold text-center">{inputValidation}</p>
                : <></>}

              <button className="general-button" onClick={() => {
                if (createReward()) {
                  setInputOpen(false)
                  refreshPage()
                } else {
                  setInputValidation('Please fill in both the description and points field.')
                }
                // TODO: find better way to ensure new Reward appears in list
              }}>
                Submit
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        <Header where="/business/manage" text="Manage Rewards" />

        <p className="break-words">
          Define how promoters of your business can spend points they earned by bringing you new customers.
        </p>

        {rewards!.length > 0
          ? rewards!.map(RewardEntry)
          : <p className="text-warning text-center text-2xl p-8">There are no active Rewards.</p>}

        <button className="general-button" onClick={() => {
          setInputOpen(true)
          setInputValidation('')
        }}>Add Reward</button>
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
