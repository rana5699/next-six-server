import { Router } from 'express';
import auth from '../../middleware/authMiddleware'; // Adjust the path to your auth middleware if needed
import { reviewControllers } from './reviewControlers';

const reviewRouter = Router();

// Route to get all reviews (accessible by admins only)
reviewRouter.get('/all-reviews', auth('admin'), reviewControllers.getReviews );


// Route to create a new review (accessible by customers only)
reviewRouter.post('/review', auth('customer',"admin"),reviewControllers.createReview );


export default reviewRouter;
