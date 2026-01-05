import axios from 'axios';
import { SpotifyTrack } from '../types';

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    // Get new token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000; // Refresh 1 min before expiry

    return this.accessToken;
  }

  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const token = await this.getAccessToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit,
      },
    });

    return response.data.tracks.items;
  }

  async getTrack(trackId: string): Promise<SpotifyTrack> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const token = await this.getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const token = await this.getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.items.map((item: any) => item.track);
  }
}

export default new SpotifyService();
