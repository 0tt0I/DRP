import { NextFunction, Request, Response } from 'express'
import { firebaseAdmin } from '../plugins/firebase-admin'

export default async function readCookie (req: Request, res: Response, next: NextFunction) {
  const authToken = req.cookies.auth_token
  console.log(authToken)
  if (authToken) {
    try {
      await firebaseAdmin.auth().verifyIdToken(authToken)
      console.log('Good!')
      next()
    } catch {
      res.sendStatus(403)
      console.log('Bad 1')
    }
  } else {
    res.sendStatus(403)
    console.log('Bad 2')
  }
}
