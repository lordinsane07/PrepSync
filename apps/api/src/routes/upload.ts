import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getUploadSignature } from '../controllers/upload.controller';

const router = Router();

router.post('/upload/signature', requireAuth, getUploadSignature);

export default router;
