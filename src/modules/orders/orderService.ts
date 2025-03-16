import { StatusCodes } from 'http-status-codes';
import AppError from '../../middleware/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { OrderModel } from './orderModel';
import { IOrderIntentStatus } from './orderInterface';
import User from '../users/userModel';
import { sendEmail } from '../../utils/emailService';

// all orders
const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(OrderModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await orderQuery.countTotal();
  const result = await orderQuery.modelQuery.populate('medicines.medicineId');

  if (result?.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order unavailable');
  }

  return {
    meta,
    result,
  };
};

// get order
const getOrderByUserId = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const orderQuery = new QueryBuilder(OrderModel.find({ userId }), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await orderQuery.countTotal();
  const result = await orderQuery.modelQuery.populate('medicines.medicineId');

  if (result?.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order unavailable');
  }

  const totalCost = result.reduce((acc, item) => {
    return acc + (item.totalPrice || 0);
  }, 0);
  return {
    meta,
    result,
    totalCost,
  };
};

// update order status
const updateOrderIntentStatus = async (
  orderId: string,
  orderIntentStatus: IOrderIntentStatus,
) => {
  // Find the order by ID
  const order = await OrderModel.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // check user email
  const user = await User.findById(order.userId);

  if (!user) {
    throw new Error('User not found here!');
  }

  const currentStatus = order.orderIntent;

  if (currentStatus === 'processing') {
    order.orderIntent = 'shipped';
  } else if (currentStatus === 'shipped') {
    order.orderIntent = 'delivered';
  } else {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${orderIntentStatus.intentStatus}`,
    );
  }

  // send email notification
  await sendEmail(
    user.email,
    'Order Confirmation',
    `
    <div style="font-family: 'Poppins', Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Order Confirmation</h2>
      <p>Your order has been successfully <strong>${currentStatus}</strong>.</p>
      <p>Order ID: <span style="font-weight: bold; color: #ff5722;">${orderId}</span></p>
      <p>Thank you for shopping with us! 😊</p>
    </div>
    `,
  );

  // Save the updated order
  const updatedOrder = await order.save();

  return updatedOrder;
};

export const orderServices = {
  getAllOrders,
  getOrderByUserId,
  updateOrderIntentStatus,
};
