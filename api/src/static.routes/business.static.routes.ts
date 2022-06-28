import { Router } from 'express'
import { join } from 'path'
import { environmentConfig } from '../config/config'

export const businessRouter = Router()

businessRouter.use('/', (req, res) => {
  res.sendFile(join(environmentConfig.appCompiledStatic, req.path + '.html'))
})
