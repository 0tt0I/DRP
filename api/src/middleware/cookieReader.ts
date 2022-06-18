import { NextFunction, Request, Response } from 'express'

export default async function readCookie (req: Request, _res: Response, next: NextFunction) {
  const authToken: String = req.cookies.auth_token
  console.log('Auth token: ')
  console.log(authToken)
  next()
}
