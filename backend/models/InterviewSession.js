import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  question: String,
  answer: String,
  evaluation: {
    relevance: Number,
    technical_correctness: Number,
    communication_quality: Number,
    confidence: Number,
    problem_solving: Number,
    resume_consistency: Number,
    feedback: String,
    suggested_focus: String,
  },
  scores: {
    confidence: Number,
    technical: Number,
    communication: Number,
    relevance: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeText: String,
  extractedData: {
    skills: [String],
    projects: [String],
    technologies: [String],
    experience: [String],
    education: [String],
    certifications: [String],
    strengths: [String],
    focusAreas: [String],
    primaryDomains: [String],
    resumeSummary: String,
  },
  currentQuestion: String,
  history: [historySchema],
  report: {
    overallScore: Number,
    strengths: [String],
    improvements: [String],
    summary: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
