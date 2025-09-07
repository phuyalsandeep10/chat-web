import { z } from 'zod';

export const changePasswordModalSchema = z
  .object({
    old_password: z
      .string()
      .nonempty({ message: 'Current Password is required' })
      .min(6, {
        message: 'Current Password must be at least 6 characters long',
      }),

    new_password: z
      .string()
      .nonempty({ message: 'New Password is required' })
      .min(8, { message: 'New Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Must include at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Must include at least one special character',
      }),

    confirm_password: z
      .string()
      .nonempty({ message: 'Confirm Password is required' })
      .min(8, {
        message: 'Confirm Password must be at least 8 characters long',
      }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'The password you entered did not match.',
  });
