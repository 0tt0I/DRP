import { NextRouter } from 'next/router'
import React from 'react'
import BackButton from './BackButton'

export type HeaderProps = {
  router: NextRouter
  text: string
  where?: string
}

export default function Header (props: HeaderProps) {
  return (
    <div className="flex flex-row sm:relative sm:gap-0 gap-2 p-0.5 home-header items-center justify-center min-w-max">
      <BackButton className="sm:absolute z-10 left-0" router={props.router} where={props.where} />
      <h1 className="text-center grow">{props.text}</h1>
    </div>
  )
}
