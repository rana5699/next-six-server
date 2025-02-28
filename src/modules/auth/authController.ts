/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../middleware/AppError';
import responseHandler from '../../utils/responseHandler';
import { authServices } from './authService';
import User from '../users/userModel';
import catchAsync from '../../utils/catchAsync';

// register user
const registerUser = catchAsync(async (req, res) => {
  try {
    const userData = req.body;

    // check is user already exists
    const isExists = await User.findByEmailOrPhone(
      userData.email || userData.phone,
    );

    if (isExists) {
      return responseHandler(
        res,
        StatusCodes.CONFLICT,
        false,
        'User email/phone number already exists!',
        null,
      );
    }

    const result = await authServices.registerUser(userData);

    responseHandler(
      res,
      StatusCodes.CREATED,
      true,
      'User registered successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

// login user

const loginUser = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.loginUser(email, password);

    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'User logged in successfully',
      result,
    );
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Internal Server Error');
  }
});

export const authControllers = {
  registerUser,
  loginUser
};
