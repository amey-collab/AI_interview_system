import { evaluateAnswer, generateInterviewQuestion, generateInterviewReport } from '../utils/openai.js';
import { findSessionByIdForUser, listSessionsByUser, saveSession } from '../utils/dataStore.js';

const computeOverall = (history) => {
  if (!history || !history.length) return 0;
  const values = history.flatMap((item) => [
    item.scores.confidence,
    item.scores.technical,
    item.scores.communication,
    item.scores.relevance,
  ]);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(average * 10);
};

export const getSession = async (req, res) => {
  const session = await findSessionByIdForUser(req.params.id, req.user._id);
  if (!session) return res.status(404).json({ message: 'Session not found.' });
  return res.json({ session });
};

export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    if (!answer || !answer.trim()) return res.status(400).json({ message: 'Answer text required.' });

    const session = await findSessionByIdForUser(sessionId, req.user._id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const evaluation = await evaluateAnswer({
      answer,
      extractedData: session.extractedData,
      question: session.currentQuestion,
    });

    const historyEntry = {
      question: session.currentQuestion,
      answer,
      evaluation,
      scores: {
        confidence: Math.round(evaluation.confidence || 5),
        technical: Math.round(evaluation.technical_correctness || 6),
        communication: Math.round(evaluation.communication_quality || 6),
        relevance: Math.round(evaluation.relevance || 6),
      },
    };

    session.history.push(historyEntry);
    const nextQuestion = await generateInterviewQuestion({
      extractedData: session.extractedData,
      history: session.history,
    });

    session.currentQuestion = nextQuestion;
    session.report = await generateInterviewReport({
      extractedData: session.extractedData,
      history: session.history,
    });

    await saveSession(session);

    return res.json({ nextQuestion, evaluation, report: session.report, history: session.history });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to evaluate answer.' });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await findSessionByIdForUser(sessionId, req.user._id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const nextQuestion = await generateInterviewQuestion({
      extractedData: session.extractedData,
      history: session.history,
    });

    session.currentQuestion = nextQuestion;
    await saveSession(session);
    return res.json({ nextQuestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate the next question.' });
  }
};

export const evaluateAnswerRoute = submitAnswer;

export const getHistory = async (req, res) => {
  const sessions = await listSessionsByUser(req.user._id);
  return res.json({ sessions });
};

export const getReport = async (req, res) => {
  const session = await findSessionByIdForUser(req.params.id, req.user._id);
  if (!session) return res.status(404).json({ message: 'Session not found.' });
  return res.json({ report: session.report, history: session.history, extractedData: session.extractedData });
};
