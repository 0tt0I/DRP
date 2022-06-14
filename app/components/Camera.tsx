import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";


//add video constraints
const videoConstraints = {
    width: 250,
    height: 400,
    facingMode: "user",
};


//react component for camera
function Camera() {

    //reference to webcam
    const cameraRef = useRef<Webcam>(null);
    //state for captured image
    const [image, setImage] = useState<string | null>(null);

    //capture function with react hook (to improve performance)
    const capture = useCallback(() => {

        const currentRef = cameraRef.current;

        if (currentRef) {
            const imageSrc = currentRef.getScreenshot();
            setImage(imageSrc);
        }

    }, [cameraRef])

    //set webcam parameters, and run capture function and display
    return ( 
        <div className="camera">
            <Webcam
                audio = {false}
                height = {videoConstraints.height}
                ref = {cameraRef}
                screenshotFormat = "image/jpeg"
                width = {videoConstraints.width}
                videoConstraints = {videoConstraints}
            />
            <button 
            className="cameraCapture_button"
            onClick={capture}
            > TAKE PICTURE </button>
            {image && (
                <img src={image} />
            )}
        </div>
    )
}

export default Camera;