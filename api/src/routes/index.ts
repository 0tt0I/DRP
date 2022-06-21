import { Router } from 'express'

import { businessRouter } from './business.routes'
import { customerRouter } from './customer.routes'
import { discountRouter } from './discount.routes'
import { rewardRouter } from './reward.routes'

export const router = Router()

router.use('/business', businessRouter)
router.use('/customer', customerRouter)
router.use('/discount', discountRouter)
router.use('/reward', rewardRouter)
