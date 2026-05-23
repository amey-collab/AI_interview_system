import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import GlassCard from '../components/GlassCard.jsx';
import SessionCard from '../components/SessionCard.jsx';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/interview/history');
        setSessions(response.data.sessions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <GlassCard className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Interview history</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">All sessions and reports</h1>
          </div>
          <Link to="/dashboard" className="rounded-full border border-slate-700/80 px-5 py-3 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">Back to dashboard</Link>
        </GlassCard>

        <div className="grid gap-6">
          {sessions.length === 0 ? (
            <GlassCard className="p-10 text-slate-400">No sessions yet. Upload a resume and begin your first AI interview.</GlassCard>
          ) : (
            sessions.map((session) => <SessionCard key={session._id} session={session} />)
          )}
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;
