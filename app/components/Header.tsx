import React from 'react'
import BackButton from './BackButton'

export type HeaderProps = {
  text: string
  where?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Header (props: HeaderProps) {
  return (
    <div className="flex flex-row sm:relative sm:gap-0 gap-2 p-0.5 home-header items-center justify-center min-w-max">
      <BackButton onClick={props.onClick} className="sm:absolute z-10 left-0" where={props.where} />
      <h1 className="text-center grow break-words">{props.text}</h1>
    </div>
  )
}
