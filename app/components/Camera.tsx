import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as React from 'react'

// add video constraints
const videoConstraints = {
  width: 250,
  height: 400,
  facingMode: 'user'
}

// interface for props to communicate imageRef back to parent
interface PropsInterface {
    imageRef: Dispatch<SetStateAction<string>>;
}

// react component for camera
export default function Camera (props: PropsInterface) {
  // reference to webcam
  const cameraRef = useRef<Webcam>(null)
  // state for captured image
  const [image, setImage] = useState<string | null>(null)

  // capture function with react hook (to improve performance)
  const capture = useCallback(() => {
    const currentRef = cameraRef.current

    // gets screenshot if valid
    if (currentRef) {
      const imageSrc = currentRef.getScreenshot()
      setImage(imageSrc)

      // sends back imageRef if valid
      if (imageSrc) {
        props.imageRef(imageSrc)
      }
    }
  }, [cameraRef])

  // set webcam parameters, and run capture function and display
  return (
    <div className="camera grid gap-2 grid-cols-2 grid-flow-row-dense place-content-center">
      <Webcam
        audio = {false}
        height = {videoConstraints.height}
        ref = {cameraRef}
        screenshotFormat = "image/jpeg"
        width = {videoConstraints.width}
        videoConstraints = {videoConstraints}
        className = "place-self-center"
      />

      {image && (
        <img src={image} className="place-self-center" />
      )}

      <div className="col-span-2 grid grid-cols-2 row-span-1 gap-2 place-content-center">
        <button
          className="cameraCapture_button general-button place-self-end"
          onClick={capture}
        >&nbsp;TAKE PICTURE&nbsp;</button>

        <button
          className="cameraClear_button general-button place-self-start"
          onClick={() => {
            props.imageRef('')
            setImage(null)
          }}
        >CLEAR PICTURE</button>
      </div>
    </div>
  )
}
