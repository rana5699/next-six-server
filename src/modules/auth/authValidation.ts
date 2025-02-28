import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().email().optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  }),
});
