// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type ReferralInfo = {
  id: number,
  locationName: string,
  status: string,
  pointCount: number,
  pointThreshold: number
}

export type User = {
  id: number,
  name: string,
  avatarUrl: string | undefined,
  referrals: ReferralInfo[]
}
