import { auth } from "../firebase"

export function getUid (): string {
    return auth.currentUser!.uid
}

export function getUserEmail (): string {
    return auth.currentUser!.email!
}