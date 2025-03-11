import mongoose, { Schema } from 'mongoose';
import { IMedicine } from './medicineInterface';

// Define the Mongoose schema for Medicine
const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    generic_name: { type: String, required: true },
    brand_name: { type: [String], required: true },
    category: { type: String, required: true },
    symptoms: { type: [String], required: true },
    strength: { type: [String], required: true },
    dosage_form: { type: [String], required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: [String], required: true, match: /^https?:\/\/[^\s]+$/ },
    prescription_required: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Create a Mongoose model for Medicine
const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);

export default Medicine;
