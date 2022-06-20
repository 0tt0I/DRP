import { Router } from 'express'

import {
  businessQRScanController,
  businessAwardPointsController,
  businessGetNameAndDiscount
} from '../controllers/business.controllers'

export const businessRouter = Router()

businessRouter.post('/qr-scan', businessQRScanController)
businessRouter.post('/award-points', businessAwardPointsController)
businessRouter.post('/get-name-and-discount', businessGetNameAndDiscount)
