import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import spotifyService from '../services/spotifyService';

export class SpotifyController {
  async searchTracks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const limitNum = limit ? parseInt(limit as string) : 20;

      const tracks = await spotifyService.searchTracks(q, limitNum);

      res.json({ tracks });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTrack(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { trackId } = req.params;

      const track = await spotifyService.getTrack(trackId);

      res.json({ track });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPlaylistTracks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { playlistId } = req.params;

      const tracks = await spotifyService.getPlaylistTracks(playlistId);

      res.json({ tracks });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SpotifyController();
