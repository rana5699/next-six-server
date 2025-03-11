import express from 'express';
import { cartControllers } from './cartControllers';
import auth from '../../middleware/authMiddleware';
import validateRequest from '../../utils/validRequest';
import { cartValidationSchemas } from './cartValidation';

const cartRouters = express.Router();

cartRouters.post(
  '/cart',
  auth('customer', 'admin'),
  validateRequest(cartValidationSchemas.addToCartSchema),
  cartControllers.addToCart,
);

cartRouters.get(
  '/carts',
  auth('customer', 'admin'),
  cartControllers.getCartItemsById,
);

cartRouters.put(
  '/cart',
  auth('customer', 'admin'),
  validateRequest(cartValidationSchemas.updateCartSchema),
  cartControllers.updateCartItem,
);

cartRouters.delete(
  '/cart',
  auth('customer', 'admin'),
  cartControllers.clearCart,
);

cartRouters.delete(
  '/carts/:medicineId',
  auth('customer', 'admin'),
  cartControllers.deleteCartItem,
);

export default cartRouters;
