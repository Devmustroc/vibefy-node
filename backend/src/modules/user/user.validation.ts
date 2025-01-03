import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.string().url('Invalid URL').optional(),
});

export const followUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FollowUserInput = z.infer<typeof followUserSchema>;