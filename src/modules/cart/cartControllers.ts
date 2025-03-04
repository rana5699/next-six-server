import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { cartServices } from './cartServices';
import User from '../users/userModel';
import Cart from './cartModel';

// add to cart
const addToCart = catchAsync(async (req, res) => {
  const { medicineId, quantity } = req.body;
  const userId = req.user?.userId;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found',
      null,
    );
  }

  // Check if the user's cart exists
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ medicineId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.medicineId.toString() === medicineId,
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        medicineId,
        quantity,
      });
    }
  }

  await cart.save();

  responseHandler(
    res,
    StatusCodes.NOT_FOUND,
    false,
    'Cart added successfully',
    cart,
  );
});

const getCartItemsById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID is required',
      null,
    );
  }

  const result = await cartServices.getCartItemByUserId(userId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart items not found!',
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart items retrieved successfully.',
    result,
  );
});

// update cart item
const updateCartItem = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { medicineId, quantity } = req.body;

  // Validate the request parameters
  if (!userId || !medicineId || quantity === undefined || quantity === null) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID, medicine ID, and quantity are required',
      null,
    );
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart not found',
      null,
    );
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.medicineId.toString() === medicineId,
  );

  if (itemIndex === -1) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found in cart',
      null,
    );
  }

  // Update the quantity
  cart.items[itemIndex].quantity = quantity;

  // Recalculate totalPrice
  // cart.totalPrice = cart.items.reduce(
  //   (total, item) => total + item.price! * item.quantity,
  //   0,
  // );

  // Save the updated cart
  const result = await cart.save();

  // Check if result is null or undefined
  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart item not found!',
      {},
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart item updated successfully.',
    result,
  );
});

// delete cart item
const clearCart = catchAsync(async (req, res) => {
  const { userId, cartId } = req.params;

  // Validate the request parameters
  if (!userId || !cartId) {
    responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID and cart item ID are required',
      null,
    );
  }

  const result = await cartServices.deleteCartItem(userId, cartId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart item not found!',
      {},
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart item deleted successfully.',
    {},
  );
});

const deleteCartItem = catchAsync(async (req, res) => {
  const { userId, medicineId } = req.params;

  // Validate request parameters
  if (!userId || !medicineId) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID and medicine ID are required',
      null,
    );
  }

  // Find the user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart not found',
      null,
    );
  }

  // Remove cart item from cart
  cart.items = cart.items.filter(
    (item) => item.medicineId.toString() !== medicineId,
  );

  await cart.save();

  return responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart item deleted successfully',
    cart,
  );
});

export const cartControllers = {
  addToCart,
  getCartItemsById,
  updateCartItem,
  clearCart,
  deleteCartItem,
};
