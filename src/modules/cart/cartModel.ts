/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose'; // Import CartItem schema
import { ICart } from './cartInterface';
import Medicine from '../medicines/medicineModel';

// Medicine

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        _id: false,
        medicineId: {
          type: Schema.Types.ObjectId,
          ref: 'Medicine',
          required: true,
        },

        quantity: { type: Number, default: 1 },
        medicineInfo: {
          dosageForm: {
            type: String,
            required: [true, 'Dosage form is required'],
          },
          prescription: { type: String, },
          strength: { type: String, required: [true, 'Strength is required'] },
        },
      },
    ],

    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// pre save hook for calculating the total price
CartSchema.pre('save', async function (next) {
  try {
    let totalPrice = 0;

    if (this.items?.length > 0) {
      const medicineIds = this.items.map((item) => item.medicineId);
      const medicines = await Medicine.find({ _id: { $in: medicineIds } });

      this.items.forEach((item) => {
        const medicine = medicines.find(
          (med) => med._id.toString() === item.medicineId.toString(),
        );

        if (medicine) {
          totalPrice += medicine?.price * item.quantity!;
        }
      });
    }

    this.totalPrice = totalPrice;
    next();
  } catch (error: any) {
    next(error);
  }
});

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
