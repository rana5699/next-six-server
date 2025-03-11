/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import config from '../../config/config';
import Stripe from 'stripe';
import { IOrder } from '../orders/orderInterface';
import Medicine from '../medicines/medicineModel';
import { OrderModel } from '../orders/orderModel';
import Cart from '../cart/cartModel';

const stripe = new Stripe(config.stripeSecretKey!);

const createCheckOutSession = catchAsync(async (req, res) => {
  const { medicines, address, phoneNumber }: IOrder = req.body;

  console.log(medicines, address, phoneNumber);

  if (!Array(medicines) || medicines.length === 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Error creating checkout session. No medicines provided.',
      null,
      null,
    );
  }

  // Fetch medicine details from DB
  const medicineIds = medicines.map((item) => item.medicineId);
  const medicineData = await Medicine.find({ _id: { $in: medicineIds } });

  if (medicineData.length === 0) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'No medicines found for the provided IDs!',
      null,
      null,
    );
  }

  // Calculate total amount and prepare line items for Stripe
  let totalAmount = 0;
  const lineItems = medicines
    .map((item: any) => {
      const medicine = medicineData.find(
        (med) => med._id.toString() === item.medicineId,
      );

      if (!medicine) {
        return null;
      }

      const amount = Math.round(medicine.price) * 100;
      totalAmount += amount * item.quantity;

      return {
        price_data: {
          currency: 'BDT',
          product_data: {
            name: medicine.name,
          },
          unit_amount: amount,
        },
        quantity: item.quantity,
      };
    })
    .filter((item) => item !== null); // Remove invalid items if no medicine is found;

  // Ensure there are valid line items
  if (lineItems.length === 0) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'No valid medicines found for checkout',
      null,
      null,
    );
  }

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: lineItems,
  //     mode: 'payment',
  //     success_url: `${config.stripeSuccessUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  //     cancel_url: `${config.stripeCancelUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`,
  //     metadata: {
  //       userId: req.user?.userId.toString(),
  //       medicines: JSON.stringify(medicines),
  //       address: JSON.stringify(address),
  //       phoneNumber,
  //     },
  //   });

  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${config.stripeSuccessUrl}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripeCancelUrl}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId: req.user?.userId.toString() ?? '',
      medicines: JSON.stringify(medicines) ?? '',
      address: JSON.stringify(address) ?? '',
      phoneNumber: phoneNumber ?? '',
    },
  });
  responseHandler(res, StatusCodes.CREATED, true, 'Payment Created.', null, {
    redirectUrl: session?.url,
  });
});

// check payment
const checkPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Session ID is required',
      null,
      null,
    );
  }

  // Retrieve the Stripe session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Session not found',
      null,
      null,
    );
  }

  // Ensure amount_total is valid
  const totalAmount = session.amount_total ? session.amount_total / 100 : 0; // Convert to TK

  if (!totalAmount) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Invalid total amount.',
      null,
      null,
    );
  }

  // Extract payment details
  const { payment_status, payment_method_types, metadata } = session;

  const orderExisting = await OrderModel.findOne({
    stripeSessionId: sessionId,
  });

  if (orderExisting) {
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { stripeSessionId: sessionId },
      {
        orderIntent: payment_status === 'paid' ? 'processing' : 'pending',
        transactionInfo: {
          paymentMethod: payment_method_types[0],
          paymentStatus: payment_status,
          paymentDate: new Date(),
        },
      },
      { new: true },
    );

    return responseHandler(
      res,
      payment_status === 'paid' ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
      true,
      payment_status === 'paid'
        ? 'Payment completed. Order is now processing.'
        : 'Payment unsuccessful.',
      null,
      { orderId: updatedOrder?._id },
    );
  }

  // If order does not exist, validate and create a new one
  if (payment_status !== 'paid') {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Payment not successful.',
      null,
      null,
    );
  }

  // Parse medicines data safely
  let medicines = [];
  if (metadata?.medicines) {
    try {
      medicines = JSON.parse(metadata.medicines).map((item: any) => {
        if (
          !item.medicineInfo ||
          !item.medicineInfo.dosageForm ||
          !item.medicineInfo.strength
        ) {
          return responseHandler(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Please provide strength and dosage',
            null,
            null,
          );
        }
        return {
          medicineId: item.medicineId,
          quantity: Number(item.quantity) || 0,
          medicineInfo: {
            dosageForm: item.medicineInfo.dosageForm,
            strength: item.medicineInfo.strength,
            prescription: item.medicineInfo.prescription || '',
          },
        };
      });

      console.log(medicines);
    } catch {
      return responseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        'Invalid medicines format.',
        null,
        null,
      );
    }
  }

  // Parse and validate address
  let address: { city?: string; country?: string } = {};
  if (metadata?.address) {
    try {
      address = JSON.parse(metadata.address);
      if (!address.city || !address.country) {
        return responseHandler(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          'Incomplete address.',
          null,
          null,
        );
      }
    } catch {
      return responseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        'Invalid address format.',
        null,
        null,
      );
    }
  }

  // Create a new order
  const newOrder = new OrderModel({
    userId: metadata?.userId,
    medicines,
    totalPrice: totalAmount,
    orderIntent: 'processing',
    stripeSessionId: sessionId,
    address,
    phoneNumber: metadata?.phoneNumber || '',
    transactionInfo: {
      paymentStatus: payment_status,
      paymentMethod: payment_method_types[0],
      paymentDate: new Date(),
    },
  });

  await newOrder.save();

  // Remove paid medicines from the cart
  try {
    if (metadata?.userId && medicines.length > 0) {
      const result = // Remove paid items from the cart
        await Cart.updateOne(
          { userId: metadata?.userId },
          {
            $pull: {
              items: {
                medicineId: { $in: medicines.map((m: any) => m.medicineId) },
              },
            },
          },
        );
    }
  } catch (error) {
    console.error('Error removing items from cart:', error);
  }

  return responseHandler(
    res,
    StatusCodes.CREATED,
    true,
    'Payment successful.',
    null,
    {
      orderId: newOrder._id,
    },
  );
});

// get order data by orderId

const getOrderData = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return responseHandler(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      'Order ID is required',
      null,
      null,
    );
  }

  const order = await OrderModel.findById(orderId).populate(
    'medicines.medicineId',
  );

  if (!order) {
    return responseHandler(
      res,
      StatusCodes.NOT_FOUND,
      false,
      'Order not found',
      null,
      null,
    );
  }

  return responseHandler(
    res,
    StatusCodes.OK,
    true,
    'Order data fetched.',
    null,
    order,
  );
});

export const paymentControllers = {
  createCheckOutSession,
  checkPayment,
  getOrderData,
};
