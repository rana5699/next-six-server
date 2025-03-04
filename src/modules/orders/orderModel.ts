import { model, Schema } from 'mongoose';
import { IOrder } from './orderInterface';
import Medicine from '../medicines/medicineModel';

// Define Order Schema
export const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    medicines: [
      {
        medicineId: {
          type: Schema.Types.ObjectId,
          ref: 'Medicine',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
      },
      { _id: false },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative'],
    },
    stripeSessionId: {
      type: String,
    },
    orderIntent: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    address: {
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    phoneNumber: {
      type: String,
    },
    transactionInfo: {
      paymentMethod: {
        type: String,
        required: false,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'unpaid'],
        default: 'pending',
      },
      paymentDate: {
        type: Date,
      },
    },
  },

  { timestamps: true, versionKey: false },
);
// Pre-save hook to validate stock and update inventory
orderSchema.pre('save', async function (next) {
  try {
    let totalPrice = 0;

    for (const item of this.medicines) {
      const { quantity, medicineId } = item;

      // Fetch the product
      const medicine = await Medicine.findById(medicineId);

      if (!medicine) {
        return next(new Error(`Product with ID ${medicineId} not found`));
      }

      // Check if enough stock is available
      if (medicine.stock < quantity) {
        return next(
          new Error(
            `Insufficient stock for product: ${medicine.name}. Available: ${medicine.stock}, requested: ${quantity}.`,
          ),
        );
      }

      // calculatePrice
      totalPrice += medicine.price * quantity;

      // Reduce stock only if orderIntent is 'processing'
      if (this.orderIntent === 'processing') {
        medicine.stock -= quantity;

        // Ensure stock doesn't go negative
        if (medicine.stock < 0) {
          medicine.stock = 0;
        }

        await medicine.save();
      }
    }

    // Set total price
    this.totalPrice = totalPrice;

    next();
  } catch (error) {
    return error;
  }
});

// Define Order Model
export const OrderModel = model<IOrder>('Order', orderSchema);
