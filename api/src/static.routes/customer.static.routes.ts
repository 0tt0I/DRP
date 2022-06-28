import { Router } from 'express'
import { join } from 'path'
import { environmentConfig } from '../config/config'

export const customerRouter = Router()

customerRouter.get('/', (req, res) => {
  res.sendFile(join(environmentConfig.appCompiledStatic, req.path + '.html'))
})
