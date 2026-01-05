import { Router } from 'express';
import spotifyController from '../controllers/spotifyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/search', authenticateToken, spotifyController.searchTracks);
router.get('/tracks/:trackId', authenticateToken, spotifyController.getTrack);
router.get('/playlists/:playlistId/tracks', authenticateToken, spotifyController.getPlaylistTracks);

export default router;
