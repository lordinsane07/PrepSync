import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/db';
import { isRedisConnected } from '../config/redis';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const health = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    mongodb: isDatabaseConnected() ? 'connected' : 'disconnected',
    redis: isRedisConnected() ? 'connected' : 'disconnected',
  };

  const httpStatus =
    health.mongodb === 'connected' && health.redis === 'connected'
      ? 200
      : 503;

  res.status(httpStatus).json(health);
});

export default router;
