import { Game, Question, GamePlayer, User, Answer } from '../models';
import { CreateGameRequest, CreateQuestionRequest, Leaderboard, LeaderboardEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class GameService {
  private generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createGame(data: CreateGameRequest, createdBy: string): Promise<Game> {
    const code = this.generateGameCode();

    const game = await Game.create({
      name: data.name,
      code,
      answerTimeLimit: data.answerTimeLimit || 30,
      createdBy,
      status: 'waiting',
    });

    return game;
  }

  async getGameByCode(code: string): Promise<Game | null> {
    return await Game.findOne({
      where: { code: code.toUpperCase() },
    });
  }

  async getGameById(id: string): Promise<Game | null> {
    return await Game.findByPk(id);
  }

  async addQuestion(data: CreateQuestionRequest): Promise<Question> {
    const game = await Game.findByPk(data.gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Get the next order number
    const questionCount = await Question.count({
      where: { gameId: data.gameId },
    });

    const question = await Question.create({
      gameId: data.gameId,
      trackName: data.trackName,
      artistName: data.artistName,
      albumName: data.albumName,
      correctAnswer: data.correctAnswer,
      options: data.options,
      spotifyTrackId: data.spotifyTrackId,
      duration: data.duration || 30,
      order: questionCount,
    });

    return question;
  }

  async getGameQuestions(gameId: string): Promise<Question[]> {
    return await Question.findAll({
      where: { gameId },
      order: [['order', 'ASC']],
    });
  }

  async joinGame(gameId: string, userId: string): Promise<GamePlayer> {
    // Check if already joined
    const existing = await GamePlayer.findOne({
      where: { gameId, userId },
    });

    if (existing) {
      return existing;
    }

    const gamePlayer = await GamePlayer.create({
      gameId,
      userId,
      score: 0,
    });

    return gamePlayer;
  }

  async submitAnswer(
    gameId: string,
    questionId: string,
    userId: string,
    answer: string,
    timeToAnswer: number
  ): Promise<{ isCorrect: boolean; pointsAwarded: number }> {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();

    // Calculate points based on correctness and speed
    let pointsAwarded = 0;
    if (isCorrect) {
      const maxPoints = 1000;
      const timeBonus = Math.max(0, 1 - timeToAnswer / (question.duration * 1000));
      pointsAwarded = Math.round(maxPoints * (0.5 + 0.5 * timeBonus));
    }

    // Save answer
    await Answer.create({
      gameId,
      questionId,
      userId,
      answer,
      isCorrect,
      timeToAnswer,
      pointsAwarded,
    });

    // Update player score
    if (isCorrect) {
      const gamePlayer = await GamePlayer.findOne({
        where: { gameId, userId },
      });

      if (gamePlayer) {
        gamePlayer.score += pointsAwarded;
        await gamePlayer.save();
      }
    }

    return { isCorrect, pointsAwarded };
  }

  async getLeaderboard(gameId: string): Promise<Leaderboard> {
    const gamePlayers = await GamePlayer.findAll({
      where: { gameId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['score', 'DESC']],
    });

    const leaderboardEntries: LeaderboardEntry[] = await Promise.all(
      gamePlayers.map(async (gp, index) => {
        const answers = await Answer.findAll({
          where: { gameId, userId: gp.userId },
        });

        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const avgTime =
          correctAnswers > 0
            ? answers.filter((a) => a.isCorrect).reduce((sum, a) => sum + a.timeToAnswer, 0) /
              correctAnswers
            : 0;

        return {
          userId: gp.userId,
          username: (gp as any).user.username,
          score: gp.score,
          correctAnswers,
          averageTime: avgTime,
          rank: index + 1,
        };
      })
    );

    return {
      gameId,
      players: leaderboardEntries,
    };
  }

  async startQuestion(gameId: string, questionId: string): Promise<void> {
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.currentQuestionId = questionId;
    game.status = 'active';
    await game.save();
  }

  async endQuestion(gameId: string): Promise<void> {
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.currentQuestionId = undefined;
    await game.save();
  }

  async updateGameStatus(
    gameId: string,
    status: 'waiting' | 'active' | 'paused' | 'finished'
  ): Promise<Game> {
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.status = status;

    if (status === 'active' && !game.startedAt) {
      game.startedAt = new Date();
    } else if (status === 'finished') {
      game.finishedAt = new Date();
    }

    await game.save();
    return game;
  }
}

export default new GameService();
