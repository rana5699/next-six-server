
import { ICart } from './cartInterface';
import CartModel from './cartModel';

// add medicine in the cart
const addToCart = async (payload: ICart) => {
  const newCartData = await CartModel.create(payload);
  return newCartData;
};

// get cart by user id
const getCartItemByUserId = async (userId: string) => {
  return await CartModel.findOne({ userId });
};

// // update cart
// const updateCartItem = async (
//   userId: string,
//   cartId: string,
//   updatedData: Partial<ICart>,
// ) => {
//   return await CartModel.findOneAndUpdate(
//     { userId, _id: cartId },
//     updatedData,
//     { new: true },
//   );
// };

// delete cart
// const deleteCartItem = async (userId: string,cartId: string) => {
//   return await CartModel.findByIdAndDelete({
//     userId,
//     _id: cartId,
//   });
// };

export const cartServices = {
  addToCart,
  getCartItemByUserId,
//   deleteCartItem,
};
