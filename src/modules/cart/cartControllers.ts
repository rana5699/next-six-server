/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { cartServices } from './cartServices';
import User from '../users/userModel';
import Medicine from '../medicines/medicineModel';
import Cart from './cartModel';

// add to cart
const addToCart = catchAsync(async (req, res) => {
  const cartData = req.body;
  // Check if user exists
  const user = await User.findById(cartData.userId);
  if (!user) {
    responseHandler(res, StatusCodes.NOT_FOUND, false, 'User not found', null);
  }

  // check medicine is exists
  const medicines = await Medicine.find({
    _id: { $in: cartData.items.map((item: any) => item.medicineId) },
  });

  if (!medicines) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Medicine not found',
      null,
    );
  }

  // Check if cart already exists for the user
  const existingCart = await Cart.findOne({ userId: user?._id });

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
    responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Invalid cart data',
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Item added to cart successfully',
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
// update cart item
// const updateCartItem = catchAsync(async (req, res) => {
//   const { userId, cartItemId } = req.params;
//   const updatedCartItemData = req.body;

//   // Validate the request parameters
//   if (!userId || !cartItemId || !updatedCartItemData) {
//     responseHandler(
//       res,
//       StatusCodes.BAD_REQUEST,
//       false,
//       'User ID and cart item ID are required',
//       null,
//     );
//   }

//   // Update the cart item using the service
//   const result = await cartServices.updateCartItem(
//     userId,
//     cartItemId,
//     updatedCartItemData,
//   );

//   // Check if result is null or undefined
//   if (!result) {
//     responseHandler(
//       res,
//       StatusCodes.NOT_FOUND,
//       false,
//       'Cart item not found!',
//       {},
//     );
//   }

//   responseHandler(
//     res,
//     StatusCodes.OK,
//     true,
//     'Cart item updated successfully.',
//     result,
//   );
// });

// delete cart item
// const deleteCartItem = catchAsync(async (req, res) => {
//   const { userId, cartItemId } = req.params;

//   // Validate the request parameters
//   if (!userId || !cartItemId) {
//     responseHandler(
//       res,
//       StatusCodes.BAD_REQUEST,
//       false,
//       'User ID and cart item ID are required',
//       null,
//     );
//   }

//   const result = await cartServices.deleteCartItem(userId, cartItemId);

//   if (!result) {
//     responseHandler(
//       res,
//       StatusCodes.NOT_FOUND,
//       false,
//       'Cart item not found!',
//       {},
//     );
//   }

//   responseHandler(
//     res,
//     StatusCodes.NO_CONTENT,
//     true,
//     'Cart item deleted successfully.',
//     {},
//   );
// });

export const cartControllers = {
  addToCart,
  getCartItemsById,
  //   updateCartItem,
  //   deleteCartItem,
};
