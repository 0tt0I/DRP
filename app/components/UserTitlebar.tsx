import * as React from 'react'

import { User } from '../interfaces'
import { ImageAvatar } from './Avatar'

const UserTitlebar = (props: { user: User }) => (
  <div className='user-titlebar'>
    <ImageAvatar name={props.user.name} image={undefined} />
    <p>{props.user.name}</p>
  </div>
)

export default UserTitlebar
