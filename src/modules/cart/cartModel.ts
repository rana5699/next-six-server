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
        price: { type: Number },
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

// Calculate totalPrice before saving the cart
CartSchema.pre('save', function (next) {

  this.totalPrice = this.items.reduce((acc, item) => {
    const price = item.price || 0; 
    return acc + price * item.quantity;
  }, 0);

  next(); 
});

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
