import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { ICartItem } from './cartInterface';
import Cart from './cartModel';
import CartModel from './cartModel';

// add medicine in the cart
const addToCart = async (payload: ICartItem) => {
  const newCartData = await CartModel.create(payload);
  return newCartData;
};

// get cart by user id
const getCartItemByUserId = async (query: Record<string, unknown>) => {
  const cartsQuery = new QueryBuilder(Cart.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await cartsQuery.countTotal();
  const result = await cartsQuery.modelQuery
  .populate('userId', 'name email phone')
  .populate("items.medicineId");

  return {
    meta,
    data: result,
  };
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
  deleteCartItem,
};
