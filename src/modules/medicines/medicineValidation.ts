import { z } from 'zod';

// Zod validation schema for the IMedicine interface
export const medicineSchema = z.object({
  body: z.object({
    name: z.string(),
    generic_name: z.string(),
    brand_name: z.array(z.string()),
    category: z.string(),
    symptoms: z.array(z.string()),
    strength: z.array(z.string()),
    dosage_form: z.array(z.string()),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    imageUrl: z.string().url(),
    prescription_required: z.boolean(),
  }),
});

// zod update validation for medicine
export const medicineUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    generic_name: z.string().optional(),
    brand_name: z.array(z.string()).optional(),
    category: z.string().optional(),
    symptoms: z.array(z.string()).optional(),
    strength: z.array(z.string()).optional(),
    dosage_form: z.array(z.string()).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    imageUrl: z.string().url().optional(),
    prescription_required: z.boolean().optional(),
  }),
});

export const medicineValidations = {
  medicineSchema,
  medicineUpdateSchema,
};
