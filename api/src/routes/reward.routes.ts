import { Router } from 'express'
import {
  rewardAddController,
  rewardGetEligibleController,
  rewardGetInfoController, rewardsGetAllController,
  rewardDeleteController
} from '../controllers/reward.controllers'

export const rewardRouter = Router()

rewardRouter.post('/get-reward-info', rewardGetInfoController)
rewardRouter.post('/get-all-rewards', rewardsGetAllController)
rewardRouter.post('/add-reward', rewardAddController)
rewardRouter.post('/delete-reward', rewardDeleteController)
rewardRouter.post('/get-eligible-rewards', rewardGetEligibleController)
