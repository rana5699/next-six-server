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

  // Example: Get the product with the most orders
  const topProduct = await OrderModel.aggregate([
    { $unwind: '$medicines' },
    { $group: { _id: '$medicines.medicineId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: 'medicines',
        localField: '_id',
        foreignField: '_id',
        as: 'medicine',
      },
    },
    { $unwind: '$medicine' },
    {
      $project: {
        productId: '$_id',
        totalOrders: '$count',
        productName: '$medicine.name',
        productPrice: '$medicine.price',
      },
    },
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
    totalPendingOrders,
    topProduct: topProduct.length > 0 ? topProduct : null,
  };
};

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
        _id: { $dayOfMonth: '$createdAt' },
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
