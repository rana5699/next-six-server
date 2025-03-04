import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { userServices } from './userService';

// get user by email
const getUserByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await userServices.getUserByEmail(email);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'User retrieved successfully',
    null,
    result,
  );
});

// get user by id
const getSingleUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.getSingleUserById(userId);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found from here!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'User retrieved successfully',
    null,
    result,
  );
});

// update user
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updatedUserData = req.body;

  const result = await userServices.updateUser(userId, updatedUserData);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'User updated successfully',
    null,
    result,
  );
});

// get all users (Admin only)
const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers(req.query);

  if (!result || result?.data?.length === 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'No users found!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Users retrieved successfully',
    result?.meta,
    result?.data,
  );
});

// Delete User (Admin)
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userServices.deleteUser(id);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'User not found!',
      null,
      result,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'User deleted successfully',
    null,
    result,
  );
});

export const userControllers = {
  getAllUsers,
  getUserByEmail,
  updateUser,
  getSingleUserById,

  deleteUser,
};
