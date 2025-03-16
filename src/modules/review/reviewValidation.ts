import { z } from 'zod';

// Define the validation schema
const reviewSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User is required'),
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().min(1, 'Comment cannot be empty'),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().min(1, 'Comment cannot be empty'),
  }),
});

export { reviewSchema, updateReviewSchema };
