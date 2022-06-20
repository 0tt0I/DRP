import { Router } from 'express'
import { discountGetInfoController } from 'src/controllers/discount.controller'

export const discountRouter = Router()

discountRouter.post('/get-discount-info', discountGetInfoController)
