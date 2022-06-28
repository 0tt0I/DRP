import { Router } from 'express'

import { businessRouter } from './business.static.routes'
import { customerRouter } from './customer.static.routes'

export const router = Router()

router.use('/business/*', businessRouter)
router.use('/customer/*', customerRouter)
