import { z } from 'zod';

// Zod schema for CartItem validation
const addToCartSchema = z.object({
  body: z.object({
    medicineId: z
      .string({ required_error: 'Medicine ID is required' })
      .length(24, {
        message: 'Invalid Medicine ID format, must be 24 characters long',
      })
      .regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid Medicine ID format, must be a valid MongoDB ObjectId',
      }),

    quantity: z
      .number({ invalid_type_error: 'Quantity must be a number' })
      .optional(),

      medicineInfo: z.object({
        dosageForm: z.string({ required_error: "Dosage form is required" }),
        prescription: z.string().optional(),
        strength: z.string({ required_error: "Strength is required" }),
      }),
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
