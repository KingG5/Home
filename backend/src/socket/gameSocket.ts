import { Server, Socket } from 'socket.io';
import gameService from '../services/gameService';
import { User, Question } from '../models';

interface TimerData {
  gameId: string;
  questionId: string;
  startTime: number;
  endTime: number;
  interval?: NodeJS.Timeout;
}

export class GameSocketHandler {
  private io: Server;
  private activeTimers: Map<string, TimerData> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  handleConnection(socket: Socket): void {
    console.log(`Socket connected: ${socket.id}`);

    // Join game room
    socket.on('game:join', async (gameCode: string, userId: string) => {
      try {
        const game = await gameService.getGameByCode(gameCode);
        if (!game) {
          socket.emit('error', 'Game not found');
          return;
        }

        // Join player to game
        await gameService.joinGame(game.id, userId);

        // Join socket room
        socket.join(game.id);

        // Get user info
        const user = await User.findByPk(userId);
        if (user) {
          // Notify room about new player
          this.io.to(game.id).emit('game:player-joined', {
            userId: user.id,
            username: user.username,
          });

          // Send current game state to new player
          socket.emit('game:state', game);

          // Send current leaderboard
          const leaderboard = await gameService.getLeaderboard(game.id);
          socket.emit('leaderboard:updated', leaderboard);
        }
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', 'Failed to join game');
      }
    });

    // Leave game
    socket.on('game:leave', async (gameId: string, userId: string) => {
      socket.leave(gameId);
      this.io.to(gameId).emit('game:player-left', userId);
    });

    // Submit answer
    socket.on('answer:submit', async (data) => {
      try {
        const { gameId, questionId, userId, answer, timestamp } = data;

        const timeToAnswer = Date.now() - timestamp;

        const result = await gameService.submitAnswer(
          gameId,
          questionId,
          userId,
          answer,
          timeToAnswer
        );

        // Send result to player
        socket.emit('answer:result', {
          userId,
          isCorrect: result.isCorrect,
          pointsAwarded: result.pointsAwarded,
        });

        // Update leaderboard for all players
        const leaderboard = await gameService.getLeaderboard(gameId);
        this.io.to(gameId).emit('leaderboard:updated', leaderboard);
      } catch (error) {
        console.error('Error submitting answer:', error);
        socket.emit('error', 'Failed to submit answer');
      }
    });

    // DJ: Start question
    socket.on('dj:start-question', async (data) => {
      try {
        const { gameId, questionId } = data;

        await gameService.startQuestion(gameId, questionId);

        const question = await Question.findByPk(questionId);
        if (!question) {
          socket.emit('error', 'Question not found');
          return;
        }

        const startTime = Date.now();
        const endTime = startTime + question.duration * 1000;

        // Remove correctAnswer from question data sent to players
        const { correctAnswer, ...questionData } = question.toJSON();

        // Broadcast question to all players
        this.io.to(gameId).emit('question:started', {
          question: questionData,
          startTime,
          endTime,
        });

        // Start timer
        this.startQuestionTimer(gameId, questionId, startTime, endTime);
      } catch (error) {
        console.error('Error starting question:', error);
        socket.emit('error', 'Failed to start question');
      }
    });

    // DJ: End question
    socket.on('dj:end-question', async (gameId: string) => {
      try {
        await gameService.endQuestion(gameId);

        // Stop timer
        this.stopQuestionTimer(gameId);

        const game = await gameService.getGameById(gameId);
        if (game && game.currentQuestionId) {
          const question = await Question.findByPk(game.currentQuestionId);
          if (question) {
            // Broadcast correct answer
            this.io.to(gameId).emit('question:ended', {
              questionId: question.id,
              correctAnswer: question.correctAnswer,
            });
          }
        }
      } catch (error) {
        console.error('Error ending question:', error);
        socket.emit('error', 'Failed to end question');
      }
    });

    // DJ: Pause game
    socket.on('dj:pause-game', async (gameId: string) => {
      try {
        await gameService.updateGameStatus(gameId, 'paused');
        const game = await gameService.getGameById(gameId);
        this.io.to(gameId).emit('game:state', game);
      } catch (error) {
        console.error('Error pausing game:', error);
        socket.emit('error', 'Failed to pause game');
      }
    });

    // DJ: Resume game
    socket.on('dj:resume-game', async (gameId: string) => {
      try {
        await gameService.updateGameStatus(gameId, 'active');
        const game = await gameService.getGameById(gameId);
        this.io.to(gameId).emit('game:state', game);
      } catch (error) {
        console.error('Error resuming game:', error);
        socket.emit('error', 'Failed to resume game');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  }

  private startQuestionTimer(
    gameId: string,
    questionId: string,
    startTime: number,
    endTime: number
  ): void {
    // Clear existing timer if any
    this.stopQuestionTimer(gameId);

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.ceil((endTime - now) / 1000));

      this.io.to(gameId).emit('timer:tick', remainingTime);

      if (now >= endTime) {
        this.stopQuestionTimer(gameId);
        this.io.to(gameId).emit('timer:tick', 0);
      }
    }, 1000);

    this.activeTimers.set(gameId, {
      gameId,
      questionId,
      startTime,
      endTime,
      interval,
    });
  }

  private stopQuestionTimer(gameId: string): void {
    const timer = this.activeTimers.get(gameId);
    if (timer?.interval) {
      clearInterval(timer.interval);
      this.activeTimers.delete(gameId);
    }
  }
}
