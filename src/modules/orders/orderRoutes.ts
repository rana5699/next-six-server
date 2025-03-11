import { Router } from 'express';
import { orderControllers } from './orderController';
import auth from '../../middleware/authMiddleware';

const orderRouter = Router();

orderRouter.get('/all-orders', auth('admin'), orderControllers.allOrders);

orderRouter.get(
  '/orders',
  auth('admin', 'customer'),
  orderControllers.getOrder,
);

orderRouter.put(
  '/order/:id',
  auth('admin'),
  orderControllers.updateOrderStatus,
);

export default orderRouter;
