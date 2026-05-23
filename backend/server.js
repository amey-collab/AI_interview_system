import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interview.js';
import { authenticate } from './middleware/auth.js';
import { uploadResume } from './controllers/resumeController.js';
import { generateQuestion, evaluateAnswerRoute } from './controllers/interviewController.js';

dotenv.config();
const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/api/status', (req, res) => res.json({ status: 'ok', version: '0.1.0' }));
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

// The API routes are mounted under /api/*.
// Direct non-prefixed endpoints are intentionally not exposed to keep the router consistent.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const START_PORT = Number(process.env.PORT) || 4001;
const MAX_PORT_ATTEMPTS = 10;

const startServer = (port, attempt = 1) => {
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }
    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
};

startServer(START_PORT);
