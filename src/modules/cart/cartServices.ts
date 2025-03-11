import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { ICartItem } from './cartInterface';
import CartModel from './cartModel';

// add medicine in the cart
const addToCart = async (payload: ICartItem) => {
  const newCartData = (await CartModel.create(payload))
  return newCartData;
};

// get cart by user id
const getCartItemByUserId = async (
  userId: string,
) => {
  const cartData = await CartModel.findOne({ userId: userId })
    .populate('userId', 'name email phone')
    .populate('items.medicineId');

  return cartData;
};

// update cart
const updateCartItem = async (
  userId: string,
  medicineId: string,
  quantity: number,
) => {
  return await CartModel.findOneAndUpdate(
    { userId, 'items.medicineId': medicineId },
    {
      $set: { 'items.$.quantity': quantity },
    },
    { new: true },
  );
};

// clear cart by userId
 const clearCartByUserId = async (userId: string) => {
  return await CartModel.findOneAndDelete({ userId });
};

// delete cart
const deleteCartItem = async (userId: string, cartId: string) => {
  return await CartModel.findByIdAndDelete({
    userId,
    _id: cartId,
  });
};

export const cartServices = {
  addToCart,
  getCartItemByUserId,
  updateCartItem,
  clearCartByUserId,
  deleteCartItem,
};
