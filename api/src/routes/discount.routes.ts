import { Router } from 'express'
import { discountGetInfoController, discountsGetAllController } from '../controllers/discount.controllers'

export const discountRouter = Router()

discountRouter.post('/get-discount-info', discountGetInfoController)
discountRouter.post('/get-all-discounts', discountsGetAllController)

