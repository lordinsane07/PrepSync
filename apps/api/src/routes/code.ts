import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { submitCode, getSubmissionStatus, getLanguages } from '../controllers/code.controller';

const router = Router();

router.post('/code/submit', requireAuth, submitCode);
router.get('/code/status/:token', requireAuth, getSubmissionStatus);
router.get('/code/languages', getLanguages);

export default router;
