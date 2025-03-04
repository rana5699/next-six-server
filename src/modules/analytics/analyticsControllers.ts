import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { analyticsServices } from './analyticsServices';

const analyticsController = catchAsync(async (req, res) => {
  const result = await analyticsServices.analyticsService();

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Analytics fetched successfully',
    result,
  );
});

const getMonthlySales = catchAsync(async (req, res) => {
  const result = await analyticsServices.getMonthlySales();

  responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Monthly analytics fetched successfully',
    result,
  );
});

export const analyticsControllers = {
  analyticsController,
  getMonthlySales,
};
