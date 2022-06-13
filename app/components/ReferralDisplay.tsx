import * as React from 'react'

import { DefaultAvatar } from './Avatar'
import { ReferralInfo } from '../interfaces'

type ReferralProps = {
  refs: ReferralInfo[]
}

const PointDisplay = (points: number, pointThreshold: number) => {
  const classes = 'place-self-center'
  const weight = (x: string) => (points >= pointThreshold) ? x + ' font-extrabold' : x + ' font-bold'
  const colour = (x: string) => (points >= pointThreshold) ? x + ' text-green-700' : x + ' text-rose-500'

  return (<p className={colour(weight(classes))}>
    {points} / {pointThreshold}
  </p>)
}

export const ReferralDisplay = (referral: ReferralInfo) => (
  <div className='referral-display'>
    <DefaultAvatar name={referral.locationName} />
    <div className='grid grid-rows-2 grid-cols-1 font-bold'>
      <p>{referral.locationName}</p>
      <p>{referral.status}</p>
    </div>
    {PointDisplay(referral.pointCount, referral.pointThreshold)}
  </div>
)

const NoRefs = (<div className='no-referrals'>
  <p>You have no referrals.</p>
</div>)

export const ReferralListDisplay = ({ refs: refArr }: ReferralProps) => (
  <div className={'referral-list-display ' + (refArr.length === 0 ? 'grid-rows-1' : 'grid-rows-3')}>
    {refArr.length === 0 ? NoRefs : refArr.slice(0, 3).map(ReferralDisplay)}
  </div>
)
