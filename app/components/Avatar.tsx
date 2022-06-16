import * as React from 'react'

const divClasses = 'place-self-center grid grid-cols-1 grid-rows-1 rounded-full bg-slate-500 font-extrabold w-12 h-12'
const imageClasses = 'w-12 h-12'
const h1Classes = 'place-self-center text-2xl text-slate-100'

export const DefaultAvatar = (props: { name: string }) => {
  const uname = props.name === '' ? '@' : props.name
  return (
    <div className={divClasses}>
      <h1 className={h1Classes}>{uname.charAt(0)}</h1>
    </div>
  )
}

export const ImageAvatar = (props: { name: string, image: string | undefined }) => {
  if (props.image === undefined) {
    return <DefaultAvatar name={props.name} />
  }

  return (
    <div className={divClasses}>
      <div className={imageClasses} style={{ backgroundPosition: 'center center', backgroundImage: props.image }}></div>
    </div>
  )
}
