import { useRef } from "react";
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
    const cameraRef = useRef(null);

    //set webcam parameters
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
        </div>
    )
}

export default Camera;