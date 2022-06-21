import { Router } from 'express'
import {
  discountAddController,
  discountGetEligibleController,
  discountGetInfoController, discountsGetAllController
} from '../controllers/discount.controllers'

export const discountRouter = Router()

discountRouter.post('/get-discount-info', discountGetInfoController)
discountRouter.post('/get-all-discounts', discountsGetAllController)
discountRouter.post('/add-discount', discountAddController)
discountRouter.post('/get-eligible-discounts', discountGetEligibleController)
