import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { reviewServices } from './reviewServices';

// Controller to create a review
export const createReview = catchAsync(async (req, res) => {
  const reviewData = req.body;

  // Add the review to the database
  const result = await reviewServices.createReviewService(reviewData);

  if (!result) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Failed to add medicine. Please try again',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Review created successfully.',
    null,
    result,
  );
});

// Controller to get all reviews
export const getReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviewsService();

  if (!result || result.length === 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'No reviews found.',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Reviews retrieved successfully.',
    null,
    result,
  );
});

// review controllers
export const reviewControllers = {
  createReview,
  getReviews,
};
