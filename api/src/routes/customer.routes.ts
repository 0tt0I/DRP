import { Router } from 'express'
import { customerGetPointsController } from '../controllers/customer.controllers';

export const customerRouter = Router()

customerRouter.post("/get-points", customerGetPointsController);
