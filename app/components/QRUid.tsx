import React, { useEffect, useRef } from 'react'
import { BrowserQRCodeSvgWriter } from '@zxing/browser'

interface QRUidProps {
    uid: string
}

export default function QRUid ({ uid }: QRUidProps) {
  const qrCodeWriter = new BrowserQRCodeSvgWriter()
  const svg = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (svg.current) {
      svg.current.appendChild(qrCodeWriter.write(uid, 256, 256))
    }
  }, [])

  return (
    <div className="place-self-center white-div">
      <div className="w-[256px] h-[256px] bg-left" ref={svg}/>
    </div>
  )
}
