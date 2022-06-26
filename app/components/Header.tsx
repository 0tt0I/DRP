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
    <div className="flex flex-row gap-2 home-header place-items-center">
      <BackButton router={props.router} where={props.where} />
      <h1 className="text-center grow">{props.text}</h1>
    </div>
  )
}
