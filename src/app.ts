import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notFound from './utils/notFound';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouters from './modules/users/userRoutes';
import authRouters from './modules/auth/authRoutes';
import medicineRouters from './modules/medicines/medicineRoutes';
import cartRouters from './modules/cart/cartRoutes';
import paymentRouters from './modules/payment/paymentRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', userRouters);
app.use('/api/v1', authRouters);
app.use('/api/v1', medicineRouters);
app.use('/api/v1', cartRouters);
// app.use('/api/v1', orderRouter);
app.use('/api/v1', paymentRouters);

app.get('/', (req, res) => {
  res.send('Hello NEXT-SIX!');
});

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
