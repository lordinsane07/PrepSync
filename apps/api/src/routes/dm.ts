import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listThreads,
  createThread,
  getMessages,
  sendMessage,
} from '../controllers/dm.controller';

const router = Router();

router.get('/dms', requireAuth, listThreads);
router.post('/dms', requireAuth, createThread);
router.get('/dms/:threadId/messages', requireAuth, getMessages);
router.post('/dms/:threadId/messages', requireAuth, sendMessage);

export default router;
