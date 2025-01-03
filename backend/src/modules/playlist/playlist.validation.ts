import { z } from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Name required and must be at least 1 character long'),
  description: z.string().optional(),
  coverImage: z.string().url('Invalid URL').optional(),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name must be at least 1 character long").optional(),
  description: z.string().optional(),
  coverImage: z.string().url('Invalid URL').optional(),
});

export const addTrackSchema = z.object({
  trackId: z.string().uuid('Invalid track ID'),
});

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
export type AddTrackInput = z.infer<typeof addTrackSchema>;