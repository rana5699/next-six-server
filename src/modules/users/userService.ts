import { IUser } from './userInterface';
import User from './userModel';

// Get User by Email
const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// get User by id
const getSingleUserById = async (userId: string) => {
  return await User.findById(userId);
};

// update user

const updateUser = async (userId: string, updatedData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};

// login user

// Get All Users (For Admin)
const getAllUsers = async () => {
  return await User.find();
};

// Delete User (Admin only)
const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

export const userServices = {
  getAllUsers,
  getUserByEmail,
  getSingleUserById,
  updateUser,
  deleteUser,
};
