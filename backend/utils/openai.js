import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());

const extractText = (response) => {
  if (response.output_text) return response.output_text;
  if (response.output?.length) {
    const output = response.output[0];
    if (typeof output === 'string') return output;
    if (output.content?.length) {
      return output.content.map((item) => item.text || '').join('');
    }
  }
  return '';
};

const safeParseJson = (raw, fallback) => {
  if (!raw) return fallback;
  const normalized = raw.replace(/\n/g, ' ').trim();
  const jsonStart = normalized.indexOf('{');
  const jsonText = jsonStart >= 0 ? normalized.slice(jsonStart) : normalized;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return fallback;
  }
};

const buildResumeContext = (extractedData) => {
  const lines = [];
  if (extractedData.resumeSummary) lines.push(`Summary: ${extractedData.resumeSummary}`);
  if (extractedData.skills?.length) lines.push(`Skills: ${extractedData.skills.join(', ')}`);
  if (extractedData.technologies?.length) lines.push(`Technologies: ${extractedData.technologies.join(', ')}`);
  if (extractedData.projects?.length) lines.push(`Projects: ${extractedData.projects.join(', ')}`);
  if (extractedData.experience?.length) lines.push(`Experience: ${extractedData.experience.join(', ')}`);
  if (extractedData.education?.length) lines.push(`Education: ${extractedData.education.join(', ')}`);
  if (extractedData.certifications?.length) lines.push(`Certifications: ${extractedData.certifications.join(', ')}`);
  if (extractedData.strengths?.length) lines.push(`Strengths: ${extractedData.strengths.join(', ')}`);
  if (extractedData.focusAreas?.length) lines.push(`Focus areas: ${extractedData.focusAreas.join(', ')}`);
  if (extractedData.primaryDomains?.length) lines.push(`Primary domains: ${extractedData.primaryDomains.join(', ')}`);
  return lines.join('\n');
};

const mapHistoryToTranscript = (history) => {
  if (!history || !history.length) return 'No previous questions yet.';
  return history
    .map((item, index) => {
      const evaluationNotes = item.evaluation
        ? `\nEvaluation: ${Object.entries(item.evaluation)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}`
        : '';
      return `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}${evaluationNotes}`;
    })
    .join('\n\n');
};

const computeAverageScore = (history) => {
  if (!history || !history.length) return null;
  const numericScores = history.flatMap((item) => {
    const ev = item.evaluation;
    if (!ev || typeof ev !== 'object') return [];
    return Object.values(ev).filter((value) => typeof value === 'number');
  });
  if (!numericScores.length) return null;
  const total = numericScores.reduce((sum, value) => sum + value, 0);
  return total / numericScores.length;
};

const fallbackResumeAnalysis = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const joined = lines.join(' ');
  const simpleKeywords = ['react', 'node', 'javascript', 'typescript', 'python', 'java', 'mongodb', 'sql', 'aws', 'docker'];
  const technologies = simpleKeywords.filter((keyword) => new RegExp(`\\b${keyword}\\b`, 'i').test(joined)).map((item) => item.toUpperCase());
  return {
    skills: technologies,
    technologies,
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    strengths: ['Consistent profile context'],
    focusAreas: technologies.slice(0, 4),
    primaryDomains: [],
    resumeSummary: joined.slice(0, 400),
  };
};

const fallbackQuestion = ({ extractedData, history }) => {
  const tech = extractedData?.technologies?.[0] || extractedData?.skills?.[0] || 'your core technical stack';
  if (!history?.length) return `Walk me through one project where you used ${tech}, including your architecture and tradeoffs.`;
  if (history.length % 3 === 0) return `Describe a production issue you faced in ${tech} and how you diagnosed and resolved it.`;
  if (history.length % 2 === 0) return `How would you improve performance and reliability in a system built with ${tech}?`;
  return `What design decisions in your recent work best show your depth in ${tech}?`;
};

const fallbackEvaluation = () => ({
  relevance: 6,
  technical_correctness: 6,
  communication_quality: 6,
  confidence: 6,
  problem_solving: 6,
  resume_consistency: 6,
  feedback: 'Answer is acceptable. Improve by adding concrete metrics, deeper tradeoff discussion, and clearer structure.',
  suggested_focus: 'use specific examples and measurable outcomes',
});

const fallbackReport = (history) => ({
  overallScore: Math.round((computeAverageScore(history) || 6) * 10),
  strengths: ['Good consistency', 'Clear intent'],
  improvements: ['Add deeper technical detail', 'Quantify outcomes'],
  summary: 'Session completed using fallback evaluation. For richer personalization, enable OpenAI access.',
});

export const analyzeResume = async (text) => {
  if (!hasOpenAIKey) return fallbackResumeAnalysis(text);
  const prompt = `You are an expert resume analyst for technical interview preparation. Analyze the resume text below and extract a detailed structured profile in JSON. Include the following keys: skills, technologies, projects, experience, education, certifications, strengths, focusAreas, primaryDomains, and resumeSummary. Use arrays for items and a single string for resumeSummary. If a section is missing, return an empty array. Do not add unrelated content. Resume text:\n${text}`;

  let response;
  try {
    response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_tokens: 900,
    });
  } catch (error) {
    return fallbackResumeAnalysis(text);
  }

  const raw = extractText(response);
  return safeParseJson(raw, {
    skills: [],
    technologies: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    strengths: [],
    focusAreas: [],
    primaryDomains: [],
    resumeSummary: '',
  });
};

export const generateInterviewQuestion = async ({ extractedData, history }) => {
  const MAX_QUESTIONS = parseInt(process.env.MAX_QUESTIONS || '20', 10);
  const resumeContext = buildResumeContext(extractedData);
  const previousConversation = mapHistoryToTranscript(history);
  const averageScore = computeAverageScore(history);
  const shouldPerformContinuationCheck = history?.length >= MAX_QUESTIONS;

  if (shouldPerformContinuationCheck) {
    const continuePrompt = `You are an AI interview director. The candidate has completed ${history.length} questions, with an average answer quality score of ${averageScore?.toFixed(1) ?? 'N/A'} out of 10. The resume context is below:\n${resumeContext}\n\nConversation history:\n${previousConversation}\n\nReturn a JSON object only with keys: continue (true/false), reason (short text), suggested_limit (integer total number of questions to allow if continuing).`;
    try {
      if (!hasOpenAIKey) return fallbackQuestion({ extractedData, history });
      const decisionResponse = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: continuePrompt,
        max_tokens: 160,
      });
      const decisionRaw = extractText(decisionResponse);
      const decision = safeParseJson(decisionRaw, { continue: false, reason: 'Unable to determine continuation.', suggested_limit: MAX_QUESTIONS });
      if (!decision.continue) return null;
      const cap = MAX_QUESTIONS * 2;
      const finalLimit = Math.min(decision.suggested_limit || MAX_QUESTIONS, cap);
      if (history.length >= finalLimit) return null;
    } catch (error) {
      return null;
    }
  }

  const questionPrompt = `You are a human-like AI interviewer. Use ONLY the resume details and previous interview flow below to generate one personalized interview question. The question should be relevant to the candidate's resume and never random or unrelated. If the resume mentions React, ask React-specific questions. If it mentions Machine Learning, ask ML questions. If it mentions Java, ask Java/OOP/DSA questions. If it mentions Cloud, ask AWS/Kubernetes questions. If the resume includes projects, ask deep project explanation and impact questions. Create a balanced mix of technical, scenario, project, HR, and follow-up style questions over the course of the interview. Do not repeat the same question. Avoid generic questions unless no other information is available. Output only the final question text.\n\nResume context:\n${resumeContext}\n\nPrevious conversation:\n${previousConversation}`;

  if (!hasOpenAIKey) return fallbackQuestion({ extractedData, history });
  let response;
  try {
    response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: questionPrompt,
      max_tokens: 180,
    });
  } catch (error) {
    return fallbackQuestion({ extractedData, history });
  }

  const question = extractText(response).trim();
  if (!question) {
    throw new Error('OpenAI did not return a question.');
  }
  return question;
};

export const evaluateAnswer = async ({ answer, extractedData, question }) => {
  if (!hasOpenAIKey) return fallbackEvaluation();
  const resumeContext = buildResumeContext(extractedData);
  const prompt = `You are an expert interview evaluator. Review the candidate answer, the interview question, and the resume context below. Return a JSON object only with numeric scores from 1 to 10 for relevance, technical_correctness, communication_quality, confidence, problem_solving, and resume_consistency. Also include feedback as a short human-like paragraph and a suggested_focus string for the next question.\n\nResume context:\n${resumeContext}\n\nQuestion:\n${question}\n\nAnswer:\n${answer}`;

  let response;
  try {
    response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_tokens: 260,
    });
  } catch (error) {
    return fallbackEvaluation();
  }

  const raw = extractText(response);
  return safeParseJson(raw, {
    relevance: 6,
    technical_correctness: 6,
    communication_quality: 6,
    confidence: 5,
    problem_solving: 6,
    resume_consistency: 6,
    feedback: 'Your answer is generally aligned with the resume. Add more specific technical examples and concise storytelling for stronger impact.',
    suggested_focus: 'deepen technical architecture or project impact details',
  });
};

export const generateInterviewReport = async ({ extractedData, history }) => {
  if (!hasOpenAIKey) return fallbackReport(history);
  const resumeContext = buildResumeContext(extractedData);
  const transcript = mapHistoryToTranscript(history);
  const prompt = `You are an AI interview coach summarizing a technical interview session. Based on the resume details and the candidate's interview history with evaluation scores, provide a JSON object with overallScore (0-100), strengths (array), improvements (array), and summary (short paragraph). Keep the tone professional, encouraging, and human-like.\n\nResume context:\n${resumeContext}\n\nInterview history:\n${transcript}`;

  let response;
  try {
    response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_tokens: 260,
    });
  } catch (error) {
    return fallbackReport(history);
  }

  const raw = extractText(response);
  return safeParseJson(raw, {
    overallScore: Math.round((computeAverageScore(history) || 6) * 10),
    strengths: ['Clear resume alignment', 'Relevant technical focus', 'Solid communication style'],
    improvements: ['Use more concrete technical examples', 'Explain tradeoffs more clearly'],
    summary: 'The candidate has built a strong resume-driven interview flow. Continue improving depth and specificity in answers.',
  });
};
