import { z } from 'zod';

// Zod schema for CartItem validation
const addToCartSchema = z.object({
  body: z.object({
    medicineId: z
      .string()
      .length(24, 'Invalid Product ID format')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
    quantity: z.number().optional(),
  }),
});

const updateCartSchema = z.object({
  body: z.object({
    medicineId: z
      .string()
      .length(24, 'Invalid Product ID format')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
    quantity: z.number(),
  }),
});

export const cartValidationSchemas = {
  addToCartSchema,
  updateCartSchema,
};
