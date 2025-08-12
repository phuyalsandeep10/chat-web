import { z } from 'zod';

export const RoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .regex(
      /^[A-Za-z_\s]+$/,
      'Role name can only contain letters, spaces, and underscores',
    ),
});
