import { Location } from '../types/Location'
import React from 'react'

export default function updateCurrentLocation (setCurrentLocation: React.Dispatch<React.SetStateAction<Location>>) {
  navigator.geolocation.getCurrentPosition((pos) => {
    // Location has been successfully acquired
    setCurrentLocation({ longitude: pos.coords.latitude, latitude: pos.coords.longitude })
  },
  (err) => {
    // TODO: Handle this case properly
    console.log('ERROR:')
    console.log(err)
    setCurrentLocation({ longitude: -1, latitude: -1 })
  })
}