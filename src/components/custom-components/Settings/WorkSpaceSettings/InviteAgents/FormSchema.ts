import { z } from 'zod';

export const AddOrEditAgentSchema = z.object({
  email: z.string().email('Enter a valid email'),
  fullName: z.string().min(1, 'Full name is required'),
  role: z.array(z.string()).min(1, 'Select at least one role'),
  clientHandled: z.string().min(1, 'Client handled is required'),
  days: z.array(z.string()).min(1, 'Select at least one day'),
  shift: z.string().min(1, 'Shift is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  totalHours: z.string().min(1, 'Total hours is required'),
  team: z.string().min(1, 'Select a team'),
});

// infer the type from the schema
export type AddOrEditAgentFormSchema = z.infer<typeof AddOrEditAgentSchema>;
