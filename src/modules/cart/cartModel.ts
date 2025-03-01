import { Schema, model } from 'mongoose'; // Import CartItem schema
import { ICart } from './cartInterface';

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        medicineId: {
          type: Schema.Types.ObjectId,
          ref: 'Medicine',
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// totalPrice
// CartSchema.pre('save', async function (next) {
//   // Populate the 'medicineId' field in the 'items' array
//  await this.populate('items.medicineId');


// //   // Calculate totalPrice after population
//   this.totalPrice = this.items.reduce((acc, item) => {
//     const price = item.medicineId?.price || 0; // Get the price of the medicine
//     return acc + price * item.quantity; // Add to the totalPrice
//   }, 0);

//   next();
// });

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
