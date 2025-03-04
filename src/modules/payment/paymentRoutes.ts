import express from 'express';
import auth from '../../middleware/authMiddleware';
import { paymentControllers } from './paymentControlers';

const paymentRouters = express.Router();

// For Admin Only (needs middleware)
paymentRouters.post(
  '/create-checkout-session',

  auth('admin'),

  paymentControllers.createCheckOutSession,
);

paymentRouters.post(
  '/payment-status',

  auth('admin'),
  paymentControllers.checkPayment,
);

// medicineRouters.get("/categories")

export default paymentRouters;
