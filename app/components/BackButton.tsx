import { useRouter } from 'next/router'
import React from 'react'

export type BackButtonProps = {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  where?: string
}

export default function BackButton (props: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={props.onClick ?? (() => router.push(props.where ?? '/'))}
      className={'back-button p-2 ' + props.className ?? ''}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" className="arr">
        <path d="M24 40 8 24 24 8l2.1 2.1-12.4 12.4H40v3H13.7l12.4 12.4Z"/>
      </svg>
    </button>
  )
}
