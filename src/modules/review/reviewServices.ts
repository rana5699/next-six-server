import { IReview } from './reviewInterface';
import Review from './reviewModel';

// Create a new review
export const createReviewService = async (payload: IReview) => {
  const newReview = await Review.create(payload);
  return newReview;
};

// Get all reviews
export const getAllReviewsService = async () => {
  const reviews = await Review.find();
  return reviews;
};

// export reviewServices
export const reviewServices = {
  createReviewService,
  getAllReviewsService,
};
