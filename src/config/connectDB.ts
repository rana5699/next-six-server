import mongoose from 'mongoose';
import config from './config';

export const connectDb = async () => {
  try {
    await mongoose.connect(`${config.dataBase}`);
    console.log('DB Connected Successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
