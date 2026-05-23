import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getSession,
  submitAnswer,
  getHistory,
  getReport,
  generateQuestion,
  evaluateAnswerRoute,
} from '../controllers/interviewController.js';

const router = express.Router();
router.get('/session/:id', authenticate, getSession);
router.post('/answer', authenticate, submitAnswer);
router.post('/generate-question', authenticate, generateQuestion);
router.post('/evaluate-answer', authenticate, evaluateAnswerRoute);
router.get('/history', authenticate, getHistory);
router.get('/report/:id', authenticate, getReport);

export default router;
