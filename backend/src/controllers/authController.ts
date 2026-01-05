import { Request, Response } from 'express';
import authService from '../services/authService';
import { LoginRequest, SignupRequest } from '../types';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const data: SignupRequest = req.body;

      if (!data.username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

      const result = await authService.signup(data);

      res.status(201).json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
        },
        token: result.token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginRequest = req.body;

      if (!data.username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

      const result = await authService.login(data);

      res.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
        },
        token: result.token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async quickJoin(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

      const result = await authService.quickJoin(username);

      res.status(201).json({
        user: {
          id: result.user.id,
          username: result.user.username,
        },
        token: result.token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
