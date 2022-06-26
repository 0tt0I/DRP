import { NextRouter } from 'next/router'
import React from 'react'
import ArrowBack from './ArrowBack.svg'

export type BackButtonProps = {
  router: NextRouter
  where?: string
}

export default function BackButton (props: BackButtonProps) {
  return (
    <button onClick={() => props.router.push(props.where ?? '/')} className="back-button p-2">
      <ArrowBack viewBox="0 0 48 48" className="arr" />
    </button>
  )
}
