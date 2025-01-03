import { Router } from 'express';
import { PlaylistController } from './playlist.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentications
router.use(authenticateToken);

// Playlist management
router.post('/', PlaylistController.createPlaylist);
router.get('/me', PlaylistController.getUserPlaylists);
router.get('/search', PlaylistController.searchPlaylists);

// Specific playlist operations
router.get('/:id', PlaylistController.getPlaylist);
router.put('/:id', PlaylistController.updatePlaylist);
router.delete('/:id', PlaylistController.deletePlaylist);

// Track management in playlist
router.post('/:id/tracks', PlaylistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', PlaylistController.removeTrackFromPlaylist);

export default router;