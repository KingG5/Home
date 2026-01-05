export interface User {
  id: string;
  username: string;
  email?: string;
  passwordHash?: string;
  createdAt: Date;
}

export interface Game {
  id: string;
  name: string;
  code: string;
  status: 'waiting' | 'active' | 'paused' | 'finished';
  currentQuestionId?: string;
  answerTimeLimit: number; // in seconds
  createdBy: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface Question {
  id: string;
  gameId: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  correctAnswer: string;
  options: string[];
  spotifyTrackId?: string;
  duration: number;
  createdAt: Date;
  order: number;
}

export interface Answer {
  id: string;
  gameId: string;
  questionId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  answeredAt: Date;
  timeToAnswer: number; // in milliseconds
  pointsAwarded: number;
}

export interface GamePlayer {
  id: string;
  gameId: string;
  userId: string;
  score: number;
  joinedAt: Date;
}

export interface Leaderboard {
  gameId: string;
  players: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  averageTime: number;
  rank: number;
}

export interface SocketEvents {
  // Client to Server
  'game:join': (gameCode: string, userId: string) => void;
  'game:leave': (gameId: string, userId: string) => void;
  'answer:submit': (data: { gameId: string; questionId: string; userId: string; answer: string; timestamp: number }) => void;
  'dj:start-question': (data: { gameId: string; questionId: string }) => void;
  'dj:end-question': (gameId: string) => void;
  'dj:pause-game': (gameId: string) => void;
  'dj:resume-game': (gameId: string) => void;

  // Server to Client
  'game:state': (game: Game) => void;
  'game:player-joined': (player: { userId: string; username: string }) => void;
  'game:player-left': (userId: string) => void;
  'question:started': (data: { question: Omit<Question, 'correctAnswer'>; startTime: number; endTime: number }) => void;
  'question:ended': (data: { questionId: string; correctAnswer: string }) => void;
  'leaderboard:updated': (leaderboard: Leaderboard) => void;
  'answer:result': (data: { userId: string; isCorrect: boolean; pointsAwarded: number }) => void;
  'timer:tick': (remainingTime: number) => void;
  'error': (message: string) => void;
}

export interface JWTPayload {
  userId: string;
  username: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  preview_url?: string;
}

export interface CreateGameRequest {
  name: string;
  answerTimeLimit?: number;
}

export interface CreateQuestionRequest {
  gameId: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  correctAnswer: string;
  options: string[];
  spotifyTrackId?: string;
  duration?: number;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface SignupRequest {
  username: string;
  email?: string;
  password?: string;
}

export interface QuestionType {
  type: 'artist' | 'title' | 'album' | 'year';
  question: string;
}
