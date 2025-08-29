import { z } from 'zod';

export const addPaymentHelperSchema = z.object({
  cardHolderName: z
    .string()
    .min(2, 'Card Holder Name must be at least 2 characters'),

  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Card Number must be exactly 16 digits'),

  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry Date must be in MM/YY format'),

  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),

  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().regex(/^\d{5,6}$/, 'Zip must be 5 or 6 digits'),
});
