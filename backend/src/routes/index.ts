import { Router } from 'express';
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';
import spotifyRoutes from './spotifyRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', gameRoutes);
router.use('/spotify', spotifyRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
