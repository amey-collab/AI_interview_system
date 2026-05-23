import multer from 'multer';
import { parseResume } from '../utils/resumeParser.js';
import { analyzeResume, generateInterviewQuestion, generateInterviewReport } from '../utils/openai.js';
import { createSession } from '../utils/dataStore.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } }).single('resume');

export const uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error('Resume upload error:', err);
        return res.status(400).json({ message: err.message || 'Resume upload failed.' });
      }
      if (!req.file) return res.status(400).json({ message: 'Resume file is required.' });

      const resumeText = await parseResume(req.file.buffer, req.file.originalname);
      const extractedData = await analyzeResume(resumeText);
      const currentQuestion = await generateInterviewQuestion({ extractedData, history: [] });
      const report = await generateInterviewReport({ extractedData, history: [] });

      const session = await createSession({
        user: req.user._id,
        resumeText,
        extractedData,
        currentQuestion,
        history: [],
        report,
      });

      return res.status(201).json({ sessionId: session._id, extractedData, currentQuestion, report });
    } catch (error) {
      console.error('Resume analysis failed:', error);
      const message = error.message?.includes('Unsupported resume format') ? error.message : 'Failed to analyze resume.';
      return res.status(500).json({ message });
    }
  });
};
