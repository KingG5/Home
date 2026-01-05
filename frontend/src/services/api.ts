import axios, { AxiosInstance } from 'axios';
import { AuthResponse, GameResponse, Leaderboard, QuestionWithAnswer, SpotifyTrack } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async signup(username: string, email?: string, password?: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/signup', { username, email, password });
    return response.data;
  }

  async login(username: string, password?: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', { username, password });
    return response.data;
  }

  async quickJoin(username: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/quick-join', { username });
    return response.data;
  }

  // Games
  async createGame(name: string, answerTimeLimit?: number): Promise<GameResponse> {
    const response = await this.api.post('/api/games', { name, answerTimeLimit });
    return response.data;
  }

  async getGame(code: string): Promise<GameResponse> {
    const response = await this.api.get(`/api/games/${code}`);
    return response.data;
  }

  async addQuestion(data: {
    gameId: string;
    trackName: string;
    artistName: string;
    albumName?: string;
    correctAnswer: string;
    options: string[];
    spotifyTrackId?: string;
    duration?: number;
  }): Promise<{ question: QuestionWithAnswer }> {
    const response = await this.api.post('/api/games/questions', data);
    return response.data;
  }

  async getQuestions(gameId: string): Promise<{ questions: QuestionWithAnswer[] }> {
    const response = await this.api.get(`/api/games/${gameId}/questions`);
    return response.data;
  }

  async getLeaderboard(gameId: string): Promise<{ leaderboard: Leaderboard }> {
    const response = await this.api.get(`/api/games/${gameId}/leaderboard`);
    return response.data;
  }

  async regenerateQRCode(gameId: string): Promise<{ qrCode: string }> {
    const response = await this.api.get(`/api/games/${gameId}/qrcode`);
    return response.data;
  }

  // Spotify
  async searchTracks(query: string, limit?: number): Promise<{ tracks: SpotifyTrack[] }> {
    const response = await this.api.get('/spotify/search', {
      params: { q: query, limit },
    });
    return response.data;
  }

  async getTrack(trackId: string): Promise<{ track: SpotifyTrack }> {
    const response = await this.api.get(`/spotify/tracks/${trackId}`);
    return response.data;
  }

  async getPlaylistTracks(playlistId: string): Promise<{ tracks: SpotifyTrack[] }> {
    const response = await this.api.get(`/spotify/playlists/${playlistId}/tracks`);
    return response.data;
  }
}

export default new ApiService();
