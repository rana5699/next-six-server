import { IUser } from '../users/userInterface';
import User from '../users/userModel';

// user registration
const registerUser = async (payload: IUser) => {
  // Create new user
  const newUser = await User.create(payload);
  return newUser;
};

// Login user with email/phone and password
const loginUser = async (emailOrPhone: string, password: string) => {
  // Find user by email or phone
  const user = await User.findByEmailOrPhone(emailOrPhone);

  if (!user) {
    throw new Error('User not found');
  }

  // Verify password using the method defined in UserSchema
  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Generate JWT token if login is successful
  const token = user.generateToken();

  return { accessToken: token };
};

export const authServices = {
  registerUser,
  loginUser,
};
