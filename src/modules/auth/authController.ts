import { StatusCodes } from 'http-status-codes';
import responseHandler from '../../utils/responseHandler';
import { authServices } from './authService';
import User from '../users/userModel';
import catchAsync from '../../utils/catchAsync';

// register user
const registerUser = catchAsync(async (req, res) => {
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
      null,
    );
  }

  const result = await authServices.registerUser(userData);

  responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'User registered successfully',
    null,
    result,
  );
});

// login user
const loginUser = catchAsync(async (req, res) => {
  const { phone, email, password } = req.body;

  const result = await authServices.loginUser(email || phone, password);

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'User logged in successfully',
    null,
    result,
  );
});

export const authControllers = {
  registerUser,
  loginUser,
};
