/* eslint-disable no-unused-vars */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './userInterface';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import jwT from 'jsonwebtoken';

// Extend Mongoose Document with IUser interface
export interface IUserModel extends IUser, Document {
  generateToken: () => string;
  verifyPassword(password: string): Promise<boolean>;
}

// Interface for static methods
export interface IUserModelStatic extends Model<IUserModel> {
  findByEmailOrPhone(emailOrPhone: string): Promise<IUserModel | null>;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImg: { type: String }, 
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true, versionKey: false },
);

// Middleware to hash password before saving
UserSchema.pre<IUserModel>('save', async function (next) {
  if (this.password) {
    const hashedPassword = await bcrypt.hash(
      this.password,
      Number(config.saltRound),
    );
    this.password = hashedPassword;
  }
  next();
});

// Hide  password before sending
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Hide password
  return user;
};

// Method to generate JWT token
UserSchema.methods.generateToken = function (): string {
  const jwtPayloadData = {
    userId: this._id,
    email: this.email,
    role: this.role,
  };

  return jwT.sign( jwtPayloadData , config.jwtAccessToken as string, {
    expiresIn: '1d',
  });
};

// Method to compare passwords (for login)
UserSchema.methods.verifyPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Static method to find a user by email or phone
UserSchema.statics.findByEmailOrPhone = async function (
  emailOrPhone: string,
): Promise<IUserModel | null> {
  return await this.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });
};

// Create and export Mongoose model with the IUserModelStatic interface
const User: IUserModelStatic = mongoose.model<IUserModel, IUserModelStatic>(
  'User',
  UserSchema,
);
export default User;
