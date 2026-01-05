import { io, Socket } from 'socket.io-client';
import {
  Game,
  Leaderboard,
  QuestionStartedData,
  QuestionEndedData,
  AnswerResultData,
} from '../types';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join game
  joinGame(gameCode: string, userId: string): void {
    this.socket?.emit('game:join', gameCode, userId);
  }

  // Leave game
  leaveGame(gameId: string, userId: string): void {
    this.socket?.emit('game:leave', gameId, userId);
  }

  // Submit answer
  submitAnswer(gameId: string, questionId: string, userId: string, answer: string): void {
    this.socket?.emit('answer:submit', {
      gameId,
      questionId,
      userId,
      answer,
      timestamp: Date.now(),
    });
  }

  // DJ controls
  startQuestion(gameId: string, questionId: string): void {
    this.socket?.emit('dj:start-question', { gameId, questionId });
  }

  endQuestion(gameId: string): void {
    this.socket?.emit('dj:end-question', gameId);
  }

  pauseGame(gameId: string): void {
    this.socket?.emit('dj:pause-game', gameId);
  }

  resumeGame(gameId: string): void {
    this.socket?.emit('dj:resume-game', gameId);
  }

  // Event listeners
  onGameState(callback: (game: Game) => void): void {
    this.socket?.on('game:state', callback);
  }

  onPlayerJoined(callback: (player: { userId: string; username: string }) => void): void {
    this.socket?.on('game:player-joined', callback);
  }

  onPlayerLeft(callback: (userId: string) => void): void {
    this.socket?.on('game:player-left', callback);
  }

  onQuestionStarted(callback: (data: QuestionStartedData) => void): void {
    this.socket?.on('question:started', callback);
  }

  onQuestionEnded(callback: (data: QuestionEndedData) => void): void {
    this.socket?.on('question:ended', callback);
  }

  onLeaderboardUpdated(callback: (leaderboard: Leaderboard) => void): void {
    this.socket?.on('leaderboard:updated', callback);
  }

  onAnswerResult(callback: (data: AnswerResultData) => void): void {
    this.socket?.on('answer:result', callback);
  }

  onTimerTick(callback: (remainingTime: number) => void): void {
    this.socket?.on('timer:tick', callback);
  }

  onError(callback: (message: string) => void): void {
    this.socket?.on('error', callback);
  }

  // Remove listeners
  offGameState(): void {
    this.socket?.off('game:state');
  }

  offPlayerJoined(): void {
    this.socket?.off('game:player-joined');
  }

  offPlayerLeft(): void {
    this.socket?.off('game:player-left');
  }

  offQuestionStarted(): void {
    this.socket?.off('question:started');
  }

  offQuestionEnded(): void {
    this.socket?.off('question:ended');
  }

  offLeaderboardUpdated(): void {
    this.socket?.off('leaderboard:updated');
  }

  offAnswerResult(): void {
    this.socket?.off('answer:result');
  }

  offTimerTick(): void {
    this.socket?.off('timer:tick');
  }

  offError(): void {
    this.socket?.off('error');
  }
}

export default new SocketService();
