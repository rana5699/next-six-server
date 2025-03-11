import { Types } from 'mongoose';

export interface ICartItem {
  medicineId: Types.ObjectId;
  quantity?: number;
  medicineInfo: {
    dosageForm: string;
    prescription?: string;
    strength: string;
  };
}

export interface ICart {
    userId: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
}
