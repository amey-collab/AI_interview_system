import express from 'express';
import { uploadResume } from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.post('/upload', authenticate, uploadResume);

export default router;
