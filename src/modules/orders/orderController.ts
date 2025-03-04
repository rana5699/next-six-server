import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { orderServices } from './orderService';

// get all orders
const allOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrders(req.query);

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Order retrived successfully.',
    null,
    result,
  );
});

const getOrder = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await orderServices.getOrderByUserId(userId, req.query);

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Order retrived successfully.',
    null,
    result,
  );

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Order retrived successfully',
    null,
    result,
  );
});

// update orderIntent
const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { intentStatus } = req.body;

  const result = await orderServices.updateOrderIntentStatus(id, intentStatus);

  if (!result) {
    responseHandler(
      res,
      StatusCodes.OK,
      true,
      'Order not found!',
      null,
      null,
    );
  }

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    `Order is properly ready ${intentStatus}.`,
    null,
    result,
  );
});

export const orderControllers = {
  allOrders,
  getOrder,
  updateOrderStatus,
};
