import { Router } from 'express'

import {
  businessQRScanController,
  businessAwardPointsController
} from '../controllers/business.controllers'

export const businessRouter = Router()

businessRouter.post('/qr-scan', businessQRScanController)
businessRouter.post('/award-points', businessAwardPointsController)
