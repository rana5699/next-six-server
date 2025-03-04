import { Router } from 'express';
import auth from '../../middleware/authMiddleware';
import { analyticsControllers } from './analyticsControllers';

const analyticRouters  = Router();



analyticRouters .get(
  '/dashboard/analytics',
  auth('admin',),
  analyticsControllers.analyticsController
)

analyticRouters .get(
  '/monthly-sales/analytics',
  auth('admin',),
  analyticsControllers.getMonthlySales
)



export default analyticRouters ;
