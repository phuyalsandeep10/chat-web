import { z } from 'zod';
export const registerFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must include at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must include at least one number' })
    .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`|]/, {
      message: 'Password must include at least one special character',
    }),

  name: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must be less than 30 characters' }),
});

export const headingAndSubHeadingHelper = {
  '0': {
    heading: 'Join Us',
    subHeading: 'Create your free Chatboq account and continue.',
  },
  '1': {
    heading: 'Welcome! Please confirm your email to finish setup.',
    subHeading: 'All setup are completed! Have fun with Chatboq.',
  },
  '2': {
    heading: 'Say more about yourself.',
    subHeading: 'Fill in your business information! You are almost there.',
  },
};
