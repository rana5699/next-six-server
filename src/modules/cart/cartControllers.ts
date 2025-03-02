/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { cartServices } from './cartServices';
import User from '../users/userModel';
import Medicine from '../medicines/medicineModel';
import Cart from './cartModel';

const addToCart = catchAsync(async (req, res) => {
  const cartData = req.body;
  // Check if user exists
  const user = await User.findById(cartData.userId);
  if (!user) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found',
      null,
    );
  }

  // Check if all medicines exist
  const medicines = await Medicine.find({
    _id: { $in: cartData.items.map((item: any) => item.medicineId) },
  });

  // Check for missing medicines in the request
  const missingMedicines = cartData.items.filter(
    (item: any) =>
      !medicines.some(
        (medicine: any) =>
          medicine._id.toString() === item.medicineId.toString(),
      ),
  );

  if (missingMedicines.length > 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Some medicines not found',
      missingMedicines,
    );
  }

  // Check if cart already exists for the user
  let existingCart = await Cart.findOne({ userId: user?._id });
  let result: object | null = {};

  if (existingCart) {
    // Iterate through each item in the incoming cartData
    for (let newItem of cartData.items) {
      // Check if the item already exists in the cart
      const existingItemIndex = existingCart.items.findIndex(
        (item) => item.medicineId.toString() === newItem.medicineId.toString(),
      );

      if (existingItemIndex > -1) {
        existingCart.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        existingCart.items.push(newItem);
      }
    }

    // Save the updated cart
    result = await existingCart.save();
  } else {
    // If cart doesn't exist, create a new one
    result = await cartServices.addToCart(cartData);
  }

  if (!result) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Failed to update cart',
      null,
    );
  }

  return responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Item(s) added to cart successfully',
    result,
  );
});

// get cart items
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
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price! * item.quantity,
    0,
  );

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
      null
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
      null
    );
  }

  // Find the medicine item in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.medicineId.toString() === medicineId
  );

  if (itemIndex === -1) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found in cart',
      null
    );
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price! * item.quantity,
    0
  );

  // Save the updated cart
  await cart.save();

  return responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart item deleted successfully',
    cart
  );
});

export const cartControllers = {
  addToCart,
  getCartItemsById,
  updateCartItem,
  clearCart,
  deleteCartItem,
};
