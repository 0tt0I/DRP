import { Location } from '../types/Location'
import React from 'react'

export default function registerLocationSetter (setCurrentLocation: React.Dispatch<React.SetStateAction<Location>>) {
  navigator.geolocation.getCurrentPosition((pos) => {
    // Location has been successfully acquired
    setCurrentLocation({ longitude: pos.coords.longitude, latitude: pos.coords.latitude })
  },
  (err) => {
    // TODO: Handle this case properly
    console.log('ERROR:')
    console.log(err)
    setCurrentLocation({ longitude: -1, latitude: -1 })
  })
}
