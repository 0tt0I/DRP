import { useRouter } from 'next/router'
import React from 'react'
import ArrowBack from './ArrowBack.svg'

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
      <ArrowBack viewBox="0 0 48 48" className="arr" />
    </button>
  )
}
