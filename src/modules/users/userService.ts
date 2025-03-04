import QueryBuilder from '../../queryBuilder/QueryBuilder';
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

// Get All Users (For Admin)
const getAllUsers = async (query: Record<string, unknown>) => {
  const userSearchFields = ['name', 'email', 'phone'];

  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
    meta,
    data: result,
  };
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
