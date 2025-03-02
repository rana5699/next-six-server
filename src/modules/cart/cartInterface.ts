import { Types } from 'mongoose';

export interface ICartItem {
  medicineId: Types.ObjectId;
  price?: number;
  quantity: number;
}

export interface ICart {
    userId: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
}
