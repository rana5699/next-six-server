import { z } from 'zod';

// User Validation Schema
export const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(3, 'Address must be at least 5 characters'),
    password: z.string().min(5, 'Password must be at least 6 characters'),
    role: z
      .enum(["admin","customer"])
      .default("customer"),
  }),
});

// User Validation Schema for Update
export const userUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    address: z.string().min(3, 'Address must be at least 5 characters').optional(),
    password: z.string().min(5, 'Password must be at least 6 characters').optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
  userUpdateValidationSchema,
};
