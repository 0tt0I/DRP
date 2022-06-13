import * as React from 'react'

import { User } from '../interfaces'
import { ImageAvatar } from './Avatar'

const UserTitlebar = (props: { user: User }) => {
  const divClasses = "bg-stone-800 grid grid-flow-col-dense grid-cols-1 grid-rows-2 w-80 h-32 p-4 rounded-tl-lg rounded-tr-lg"
  const textClasses = "font-bold text-slate-100 place-self-center"

  return (
    <div className={divClasses}>
      <ImageAvatar name={props.user.name} image={undefined} />
      <p className={textClasses}>{props.user.name}</p>
    </div>
  )
}

export default UserTitlebar
