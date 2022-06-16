import { Router } from 'express'

import {
  businessQRScanController
} from '../controllers/business.controllers'

export const businessRouter = Router()

businessRouter.post('/qr-scan', businessQRScanController)
