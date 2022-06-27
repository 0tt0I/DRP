import React from 'react'

const commonClasses = 'absolute h-4 w-4 bg-white rounded-full '

export default function LoadingPlaceholder () {
  return (
    <div className="loader-div">
      <div className='relative w-12 h-12 animate-spin'>
        <div className={commonClasses + 'opacity-40 top-0 left-0'}/>
        <div className={commonClasses + 'opacity-60 top-0 right-0'}/>
        <div className={commonClasses + 'opacity-80 bottom-0 right-0'}/>
        <div className={commonClasses + 'opacity-100 bottom-0 left-0'}/>
      </div>
    </div>
  )
}
