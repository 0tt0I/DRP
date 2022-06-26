import { NextRouter } from 'next/router'
import React from 'react'
import ArrowBack from './ArrowBack.svg'

export type BackButtonProps = {
  router: NextRouter
  where?: string
}

export default function BackButton (props: BackButtonProps) {
  return (
    <button onClick={() => props.router.push(props.where ?? '/')} className="general-button-nogrow p-4">
      <ArrowBack fill='white' stroke='white' />
    </button>
  )
}
