import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import gameService from '../services/gameService';
import qrCodeService from '../services/qrCodeService';
import { CreateGameRequest, CreateQuestionRequest } from '../types';

export class GameController {
  async createGame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data: CreateGameRequest = req.body;
      const userId = req.user!.userId;

      if (!data.name) {
        res.status(400).json({ error: 'Game name is required' });
        return;
      }

      const game = await gameService.createGame(data, userId);

      // Generate QR code
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const qrCode = await qrCodeService.generateQRCode(game.code, frontendUrl);

      res.status(201).json({
        game,
        qrCode,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getGame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      const game = await gameService.getGameByCode(code.toUpperCase());

      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      res.json({ game });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addQuestion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data: CreateQuestionRequest = req.body;

      if (!data.gameId || !data.trackName || !data.artistName || !data.correctAnswer || !data.options) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const question = await gameService.addQuestion(data);

      res.status(201).json({ question });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuestions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;

      const questions = await gameService.getGameQuestions(gameId);

      res.json({ questions });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;

      const leaderboard = await gameService.getLeaderboard(gameId);

      res.json({ leaderboard });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async regenerateQRCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;

      const game = await gameService.getGameById(gameId);

      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const qrCode = await qrCodeService.generateQRCode(game.code, frontendUrl);

      res.json({ qrCode });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new GameController();
