import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createTicketSchema = (isAddingNewEmail: boolean) =>
  z.object({
    title: z.string().min(1, 'Ticket title is required'),
    description: z.string().min(1, 'Description is required'),
    sender_domain: z
      .string()
      .min(1, 'Sender email is required')
      .regex(emailRegex, 'Invalid sender domain email'),
    notes: z.string().optional(),
    attachment: z.array(z.string().url('Invalid URL')).optional(),
    priority_id: z.string().min(1, 'Priority is required'),
    department_id: z.string().min(1, 'Team is required'),
    customer_email: z
      .string()
      .email('Invalid email format')
      .min(1, 'Customer email is required'),
    customer_name: isAddingNewEmail
      ? z.string().min(1, 'Customer name is required')
      : z.string().optional(),
    customer_phone: isAddingNewEmail
      ? z
          .string()
          .min(1, 'Phone number is required')
          .refine(
            (val) => /^[0-9+() -]+$/.test(val),
            'Phone number can only contain numbers, +, spaces, parentheses, and -',
          )
      : z
          .string()
          .optional()
          .refine(
            (val) => !val || /^[0-9+() -]+$/.test(val),
            'Phone number can only contain numbers, +, spaces, parentheses, and -',
          ),
    customer_location: isAddingNewEmail
      ? z.string().min(1, 'Location is required')
      : z.string().optional(),
    assignees: z.array(z.string()).optional(),
  });

export type TicketFormData = z.infer<ReturnType<typeof createTicketSchema>>;
