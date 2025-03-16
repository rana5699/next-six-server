import mongoose, { Schema, } from 'mongoose';
import { IReview } from './reviewInterface';


// Define the Mongoose schema based on the IReview interface
const reviewSchema: Schema = new Schema<IReview>(
  {
    user: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create the Mongoose model for the Review
const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
