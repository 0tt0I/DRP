import React from 'react'
import { NextRouter } from 'next/router'

export type HomeButtonProps = {
  router: NextRouter
  where?: string
  text?: string
}

export default function HomeButton (props: HomeButtonProps) {
  return (
    <button onClick={() => props.router.push(props.where ?? '/')} className="general-button">
      {props.text ?? 'Go back to Home'}
    </button>
  )
}
