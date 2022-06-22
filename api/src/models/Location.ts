import { GeoPoint } from 'firebase/firestore'

interface Location {
  longitude: number
  latitude: number
}

export function locationFromGeoPoint (input: GeoPoint) {
  return { longitude: input.longitude, latitude: input.latitude }
}

export type { Location }
