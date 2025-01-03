import { Request, Response } from 'express';
import { PlaylistService } from './playlist.service';
import { createPlaylistSchema, updatePlaylistSchema, addTrackSchema } from './playlist.validation';

export class PlaylistController {
  static async createPlaylist(req: Request, res: Response) {
    try {
      const validatedInput = createPlaylistSchema.parse(req.body);
      const result = await PlaylistService.createPlaylist(req.user.id, validatedInput);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async updatePlaylist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedInput = updatePlaylistSchema.parse(req.body);
      const result = await PlaylistService.updatePlaylist(id, req.user.id, validatedInput);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async deletePlaylist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await PlaylistService.deletePlaylist(id, req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getPlaylist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await PlaylistService.getPlaylist(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addTrackToPlaylist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedInput = addTrackSchema.parse(req.body);
      const result = await PlaylistService.addTrackToPlaylist(id, validatedInput.trackId, req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async removeTrackFromPlaylist(req: Request, res: Response) {
    try {
      const { id, trackId } = req.params;
      const result = await PlaylistService.removeTrackFromPlaylist(id, trackId, req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserPlaylists(req: Request, res: Response) {
    try {
      const result = await PlaylistService.getUserPlaylists(req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async searchPlaylists(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const result = await PlaylistService.searchPlaylists(query);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}