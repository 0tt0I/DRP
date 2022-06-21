import { Router } from 'express'
import {
  customerAddReferral,
  customerGetOtherReferrals,
  customerGetPointsController,
  customerGetUserDiscounts,
  customerGetUserReferrals,
  customerGetVisitedBusinesses,
  customerUpdatePointsController
} from '../controllers/customer.controllers'

export const customerRouter = Router()

customerRouter.post('/get-points', customerGetPointsController)
customerRouter.post('/update-points', customerUpdatePointsController)
customerRouter.post('/get-user-referrals', customerGetUserReferrals)
customerRouter.post('/get-other-referrals', customerGetOtherReferrals)
customerRouter.post('/get-user-discounts', customerGetUserDiscounts)
customerRouter.post('/add-referral', customerAddReferral)
customerRouter.post('/get-visited-businesses', customerGetVisitedBusinesses)
