import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api.js';

const InterviewRoom = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await api.get(`/interview/session/${id}`);
        setSession(response.data.session);
        setDone(!response.data.session.currentQuestion);
      } catch (error) {
        console.error(error);
      }
    };
    loadSession();
  }, [id]);

  const historyList = session?.history || [];
  const aggregateScore = useMemo(() => {
    if (!historyList.length) return 0;
    const total = historyList.reduce((sum, item) => sum + item.scores.confidence + item.scores.technical + item.scores.communication + item.scores.relevance, 0);
    return Math.round((total / (historyList.length * 40)) * 100);
  }, [historyList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || !session?.currentQuestion) return;
    setLoading(true);

    try {
      const response = await api.post('/interview/answer', { sessionId: id, answer });
      const nextQuestion = response.data.nextQuestion;
      setSession((prev) => ({
        ...prev,
        currentQuestion: nextQuestion,
        history: [
          ...prev.history,
          {
            question: prev.currentQuestion,
            answer,
            aiResponse: response.data.evaluation.feedback,
            scores: {
              confidence: response.data.evaluation.confidence,
              technical: response.data.evaluation.technical_correctness,
              communication: response.data.evaluation.communication_quality,
              relevance: response.data.evaluation.relevance,
            },
          },
        ],
      }));
      setFeedback(response.data.evaluation.feedback);
      setAnswer('');
      setDone(!nextQuestion);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="min-h-screen flex items-center justify-center text-slate-300">Loading interview...</div>;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_0.45fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-glow backdrop-blur-xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Live interview room</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">AI Interviewer</h1>
              <p className="mt-2 text-sm text-slate-400">A personalized interview based on your resume details, experience, and answers.</p>
            </div>
            <Link to="/dashboard" className="rounded-full border border-slate-700/80 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">Analytics</Link>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Question</p>
              <div className="mt-4 space-y-4">
                {done ? (
                  <div className="rounded-3xl bg-slate-900/90 p-6 text-slate-200">
                    <p className="text-lg font-semibold text-white">Interview complete</p>
                    <p className="mt-3 text-sm text-slate-300">You have reached the end of this adaptive interview session. Review your report and continue practicing with resume-driven questions.</p>
                  </div>
                ) : (
                  <p className="text-xl leading-8 text-slate-100">{session.currentQuestion}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder={done ? 'Interview finished.' : 'Answer with detail, clarity, and confidence...'}
                disabled={loading || done}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 text-slate-100 outline-none transition focus:border-violet-400 disabled:cursor-not-allowed disabled:bg-slate-900"
              />
              <button
                type="submit"
                disabled={loading || done}
                className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {loading ? 'AI is reviewing your answer...' : done ? 'Session complete' : 'Submit answer'}
              </button>
            </form>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-200/90">AI typing</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">The interviewer is reviewing your response and preparing the next personalized question.</p>
              </motion.div>
            )}

            {feedback && !loading && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-200/90">AI Feedback</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{feedback}</p>
              </motion.div>
            )}
          </div>
        </section>

        <aside className="space-y-6 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-glow backdrop-blur-xl">
          <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Session score</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-white">{aggregateScore}%</p>
                <p className="mt-2 text-sm text-slate-400">Resume-based performance</p>
              </div>
              <div className="h-24 w-24 rounded-full bg-slate-800/90 p-4">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-500 to-sky-500/80" style={{ clipPath: `circle(${aggregateScore}% at 50% 50%)` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 text-slate-300">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Recent interview history</p>
            <div className="mt-4 space-y-4">
              {historyList.slice(-3).reverse().map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm font-medium text-white">{item.question}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.answer.slice(0, 90)}...</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default InterviewRoom;
