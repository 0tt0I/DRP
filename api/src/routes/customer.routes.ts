import { Router } from 'express'
import {
  customerGetOtherReferrals,
  customerGetPointsController,
  customerGetUserReferrals,
  customerUpdatePointsController
} from '../controllers/customer.controllers'

export const customerRouter = Router()

customerRouter.post('/get-points', customerGetPointsController)
customerRouter.post('/update-points', customerUpdatePointsController)
customerRouter.post('/get-user-referrals', customerGetUserReferrals)
customerRouter.post('/get-other-referrals', customerGetOtherReferrals)
