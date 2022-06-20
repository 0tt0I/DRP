import { Router } from 'express'
import { discountGetInfoController } from '../controllers/discount.controllers'

export const discountRouter = Router()

discountRouter.post('/get-discount-info', discountGetInfoController)
