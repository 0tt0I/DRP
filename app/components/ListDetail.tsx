import * as React from 'react'

import { User } from '../interfaces'
import UserTitlebar from './UserTitlebar'
import { ReferralListDisplay } from './ReferralDisplay'

type ListDetailProps = {
  item: User
}

const ListDetail = ({ item: user }: ListDetailProps) => (
  <div>
    <h1>Detail for {user.name}</h1>
    <div className='w-80'>
      <UserTitlebar user={user} />
      <ReferralListDisplay refs={user.referrals} />
    </div>
    <p>ID: {user.id}</p>
  </div>
)

export default ListDetail
