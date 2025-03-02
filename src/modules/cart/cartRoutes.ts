import express from 'express';
import { cartControllers } from './cartControllers';

const cartRouters = express.Router();

cartRouters.post('/cart', cartControllers.addToCart);

cartRouters.get('/cart/:userId', cartControllers.getCartItemsById);

cartRouters.put('/cart/:userId', cartControllers.updateCartItem);

cartRouters.delete('/cart/:userId/:cartId', cartControllers.clearCart);

cartRouters.delete('/carts/:userId/:medicineId', cartControllers.deleteCartItem);

export default cartRouters;
