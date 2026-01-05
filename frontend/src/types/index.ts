export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Game {
  id: string;
  name: string;
  code: string;
  status: 'waiting' | 'active' | 'paused' | 'finished';
  currentQuestionId?: string;
  answerTimeLimit: number;
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface Question {
  id: string;
  gameId: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  options: string[];
  spotifyTrackId?: string;
  duration: number;
  order: number;
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  averageTime: number;
  rank: number;
}

export interface Leaderboard {
  gameId: string;
  players: LeaderboardEntry[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GameResponse {
  game: Game;
  qrCode?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  preview_url?: string;
}

export interface QuestionStartedData {
  question: Question;
  startTime: number;
  endTime: number;
}

export interface QuestionEndedData {
  questionId: string;
  correctAnswer: string;
}

export interface AnswerResultData {
  userId: string;
  isCorrect: boolean;
  pointsAwarded: number;
}
