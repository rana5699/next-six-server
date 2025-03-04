import express from 'express';
import { cartControllers } from './cartControllers';
import auth from '../../middleware/authMiddleware';

const cartRouters = express.Router();

cartRouters.post('/cart',auth("customer",'admin'), cartControllers.addToCart);

cartRouters.get('/cart/:userId', cartControllers.getCartItemsById);

cartRouters.put('/cart/:userId', cartControllers.updateCartItem);

cartRouters.delete('/cart/:userId/:cartId', cartControllers.clearCart);

cartRouters.delete('/carts/:userId/:medicineId', cartControllers.deleteCartItem);

export default cartRouters;
