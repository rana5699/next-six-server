import { Document, Types } from 'mongoose';

// Define order interface
export interface IOrder extends Document {
  userId: { type: Types.ObjectId; ref: 'User'; required: true };
  medicines: {
    medicineId: { type: Types.ObjectId; ref: 'Medicine'; required: true };
    quantity: number;
  }[];
  totalPrice?: number;
  stripeSessionId?: string;
  orderIntent?: 'pending' | 'processing' | 'shipped' | 'delivered';
  address?: {
    city: string;
    country: string;
  };
  phoneNumber?: string;
  transactionInfo?: {
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | "unpaid";
    paymentDate?: Date;
  };
}
