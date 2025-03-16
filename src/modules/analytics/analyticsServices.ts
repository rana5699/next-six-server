import Medicine from '../medicines/medicineModel';
import { OrderModel } from '../orders/orderModel';
import User from '../users/userModel';

const analyticsService = async () => {
  // Count total users
  const totalUsers = await User.countDocuments();

  // Count total products
  const totalProducts = await Medicine.countDocuments();

  // Count total orders
  const totalOrders = await OrderModel.countDocuments();

  // Calculate total revenue from orders
  const totalRevenue = await OrderModel.aggregate([
    { $match: { 'transactionInfo.paymentStatus': 'paid' } }, // Only count paid orders
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);

  // Calculate total pending orders
  const totalPendingOrders = await OrderModel.countDocuments({
    orderIntent: {
      $in: ['processing', 'pending'],
    },
  });

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
    totalPendingOrders,
  };
};

// get monthly
const getMonthlySales = async () => {
  const totalSales = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%B %d, %Y', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return totalSales;
};

export const analyticsServices = {
  analyticsService,
  getMonthlySales,
};
