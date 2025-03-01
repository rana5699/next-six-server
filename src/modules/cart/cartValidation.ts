
import { z } from 'zod';

// Zod schema for CartItem validation
export const addToCartSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .length(24, 'Invalid User ID format')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
    item: z.object({
      medicineId: z
        .string()
        .length(24, 'Invalid Product ID format')
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
      quantity: z
        .number()
        .int()
        .positive('Quantity must be a positive integer'),
    }),
  }),
});

// // Zod schema for Cart validation
// export const cartSchema = z.object({
//   userId: z
//     .string()
//     .length(24, 'Invalid User ID format')
//     .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
//   items: z.array(
//     z.object({
//       productId: z
//         .string()
//         .length(24, 'Invalid Product ID format')
//         .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
//       quantity: z
//         .number()
//         .int()
//         .positive('Quantity must be a positive number')
//         .min(1, 'Quantity must be at least 1'),
//     }),
//   ),
// });
