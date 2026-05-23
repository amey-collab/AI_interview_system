import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { motion } from 'framer-motion';
import StatBadge from '../components/StatBadge.jsx';
import GlassCard from '../components/GlassCard.jsx';

const statCards = [
  { label: 'Confidence', value: '82%', accent: 'from-violet-500 to-sky-500' },
  { label: 'Technical', value: '78%', accent: 'from-sky-500 to-cyan-500' },
  { label: 'Communication', value: '85%', accent: 'from-fuchsia-500 to-violet-500' },
];

const Dashboard = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const history = await api.get('/interview/history');
        const latest = history.data.sessions?.[0];
        if (latest) {
          const reportRes = await api.get(`/interview/report/${latest._id}`);
          setReport({ ...reportRes.data.report, latest });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatest();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <GlassCard>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Analytics dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Interview feedback + growth plan</h1>
            </div>
            <Link to="/history" className="rounded-full border border-slate-700/80 px-5 py-3 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">View full history</Link>
          </div>
        </GlassCard>

        <div className="grid gap-6 md:grid-cols-3">
          {statCards.map((card) => (
            <StatBadge key={card.label} label={card.label} value={card.value} accent={card.accent} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <GlassCard>
            <h2 className="text-xl font-semibold text-white">Summary report</h2>
            <p className="mt-4 text-slate-300">{report?.summary || 'Complete a session to see a detailed summary and score breakdown.'}</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Strengths</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                  {(report?.strengths || ['Adaptive reasoning', 'Resume alignment', 'Positive communication']).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Improvements</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                  {(report?.improvements || ['Provide more concrete examples', 'Translate results to impact']).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold text-white">Next steps</h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Revisit your projects. Add a specific challenge and solution for each major technology.</p>
              </div>
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Practice speaking your problem-solving approach clearly and with confidence.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
