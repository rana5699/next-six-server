import express from 'express';
import { userControllers } from './userController';
import validateRequest from '../../utils/validRequest';
import { userValidation } from './userValidation';
import auth from '../../middleware/authMiddleware';

const userRouters = express.Router();

userRouters.get('/user/:email', userControllers.getUserByEmail);
userRouters.get('/users/:userId', userControllers.getSingleUserById);

userRouters.put(
  '/user/:userId',
  validateRequest(userValidation.userUpdateValidationSchema),
  userControllers.updateUser,
);

userRouters.get('/users', auth('admin'), userControllers.getAllUsers); // For Admin Only (needs middleware)

userRouters.delete('/users/:id', auth('admin'), userControllers.deleteUser); // For Admin Only (needs middleware)

export default userRouters;
