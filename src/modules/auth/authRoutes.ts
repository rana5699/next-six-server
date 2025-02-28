import { loginValidationSchema } from './authValidation';
import express from 'express';
import validateRequest from '../../utils/validRequest';
import { userValidation } from '../users/userValidation';
import { authControllers } from './authController';

const authRouters = express.Router();

authRouters.post(
  '/auth/register',
  validateRequest(userValidation.userValidationSchema),
  authControllers.registerUser,
);

authRouters.post(
  '/auth/login',
  validateRequest(loginValidationSchema),
  authControllers.loginUser,
);

export default authRouters;
