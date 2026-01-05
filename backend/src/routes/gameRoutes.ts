import { Router } from 'express';
import gameController from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/games', authenticateToken, gameController.createGame);
router.get('/games/:code', gameController.getGame);
router.post('/games/questions', authenticateToken, gameController.addQuestion);
router.get('/games/:gameId/questions', authenticateToken, gameController.getQuestions);
router.get('/games/:gameId/leaderboard', gameController.getLeaderboard);
router.get('/games/:gameId/qrcode', authenticateToken, gameController.regenerateQRCode);

export default router;
