import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { cartServices } from './cartServices';
import User from '../users/userModel';
import Cart from './cartModel';
import Medicine from '../medicines/medicineModel';

// add to cart
const addToCart = catchAsync(async (req, res) => {
  const { medicineId, quantity, medicineInfo } = req.body;
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
      null,
    );
  }

  const isMedicineExists = await Medicine.findById(medicineId);

  if (!isMedicineExists) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found',
      null,
      null,
    );
  }

  // Check if the user's cart exists
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ medicineId, quantity, medicineInfo }],
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
        medicineInfo,
      });
    }
  }

  await cart.save();

  responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Cart added successfully',
    null,
    cart,
  );
});

const getCartItemsById = catchAsync(async (req, res) => {
  const result = await cartServices.getCartItemByUserId(req?.user?.userId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart items not found!',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart items retrieved successfully.',
    null,
    result,
  );
});

// update cart item
const updateCartItem = catchAsync(async (req, res) => {
  const { medicineId, quantity } = req.body;
  const userId = req.user?.userId;
  // Validate the request parameters
  if (!userId || !medicineId || quantity === undefined || quantity === null) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID, medicine ID, and quantity are required',
      null,
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
      null,
    );
  }

  // Update the quantity
  cart.items[itemIndex].quantity = quantity;

  // Save the updated cart
  const result = await cart.save();

  // Check if result is null or undefined
  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart item not found!',
      null,
      {},
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart item updated successfully.',
    null,
    result,
  );
});

// delete cart item
const clearCart = catchAsync(async (req, res) => {
  const userId = req.user?.userId;

  // Validate the request parameters
  if (!userId) {
    responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID and cart item ID are required',
      null,
      null,
    );
  }

  const result = await cartServices.clearCartByUserId(userId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Cart item not found!',
      null,
      {},
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Cart clear successfully.',
    null,
    {},
  );
});

const deleteCartItem = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const userId = req.user?.userId;

  // Validate request parameters
  if (!userId || !medicineId) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'User ID and medicine ID are required',
      null,
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
    null,
    null,
  );
});

export const cartControllers = {
  addToCart,
  getCartItemsById,
  updateCartItem,
  clearCart,
  deleteCartItem,
};
