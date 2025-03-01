import express from 'express';
import { cartControllers } from './cartControllers';

const cartRouters = express.Router();

cartRouters.post('/cart',cartControllers.addToCart);

cartRouters.get('/cart/:userId', cartControllers.getCartItemsById);

// cartRouters.put('/cart/:userId/:cartId' , cartControllers.updateCartItem);

// cartRouters.delete('/cart/:userId/:cartId', cartControllers.deleteCartItem);

export default cartRouters;
