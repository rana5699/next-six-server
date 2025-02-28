/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../middleware/AppError';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { userServices } from './userService';



// get user by email
const getUserByEmail = catchAsync(async (req, res) => {
  try {
    const { email } = req.params;

    const result = await userServices.getUserByEmail(email);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'User not found!',
        result,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'User retrieved successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

// get user by id
const getSingleUserById = catchAsync(async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userServices.getSingleUserById(userId);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'User not found from here!',
        result,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'User retrieved successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

// update user

const updateUser = catchAsync(async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUserData = req.body;

    const result = await userServices.updateUser(userId, updatedUserData);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'User not found!',
        result,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'User updated successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

// get all users (Admin only)
const getAllUsers = catchAsync(async (req, res) => {
  try {


    const result = await userServices.getAllUsers();

    if (!result || result.length === 0) {
      return responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'No users found!',
        null,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Users retrieved successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

// Delete User (Admin)
const deleteUser = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userServices.deleteUser(id);

    if (!result) {
      responseHandler(
        res,
        StatusCodes.NOT_FOUND,
        false,
        'User not found!',
        result,
      );
    }

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'User deleted successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

export const userControllers = {
  getAllUsers,
  getUserByEmail,
  updateUser,
  getSingleUserById,

  deleteUser,
};
