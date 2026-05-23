import express from 'express';
import { loginUser, registerUser, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getProfile);

export default router;
