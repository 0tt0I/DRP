import { Router } from 'express'

import { businessRouter } from './business.routes'
import { customerRouter } from './customer.routes'

export const router = Router()

router.use('/business', businessRouter)
router.use('/customer', customerRouter)
