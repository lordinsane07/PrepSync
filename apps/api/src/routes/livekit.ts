import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getLiveKitToken } from '../controllers/livekit.controller';

const router = Router();

router.get('/livekit/token/:roomName', requireAuth, getLiveKitToken);

export default router;
