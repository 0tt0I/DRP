import { Router } from 'express'
import { join } from 'path'
import { environmentConfig } from '../config/config'

export const businessRouter = Router()

businessRouter.get('*', (req, res) => {
  res.sendFile(join(environmentConfig.appCompiledStatic, req.path + '.html'))
})
