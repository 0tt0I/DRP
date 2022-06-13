import * as React from 'react'

import { DefaultAvatar } from './Avatar'
import { ReferralInfo } from '../interfaces'

type ReferralProp = {
  ref: ReferralInfo
}

type ReferralProps = {
  refs: ReferralInfo[]
}

const PointDisplay = (points: number, pointThreshold: number) => {
  const classes = "place-self-center"
  const weight = (points >= pointThreshold) ? x => x + " font-extrabold" : x => x + " font-bold"
  const colour = (points >= pointThreshold) ? x => x + " text-green-700" : x => x + " text-rose-500"

  return (<p className={colour(weight(classes))}>
    {points} / {pointThreshold}
  </p>)
}

export const ReferralDisplay = (referral: ReferralInfo) => (
  <div className="rounded-lg bg-slate-300 grid grid-rows-1 grid-cols-3 grid-flow-row-dense w-72 m-2 p-2 place-self-center">
    <DefaultAvatar name={referral.locationName} />
    <div className="grid grid-rows-2 grid-cols-1 font-bold">
      <p>{referral.locationName}</p>
      <p>{referral.status}</p>
    </div>
    {PointDisplay(referral.pointCount, referral.pointThreshold)}
  </div>
)

const NoRefs = (<div className="bg-slate-300 grid grid-rows-1 grid-cols-1 rounded-lg w-64 h-24 place-self-center text-rose-700 font-bold">
  <p className="place-self-center text-center">You have no referrals.</p>
</div>)

export const ReferralListDisplay = ({ refs: refArr }: ReferralProps) => (
  <div className={"w-80 h-64 bg-stone-500 grid grid-cols-1 " + (refArr.length == 0 ? "grid-rows-1" : "grid-rows-3")}>
    {refArr.length == 0 ? NoRefs : refArr.slice(0, 3).map(ReferralDisplay)}
  </div>
)