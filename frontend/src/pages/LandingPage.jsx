import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFeather, FiShield } from 'react-icons/fi';
import FeatureCard from '../components/FeatureCard.jsx';

const cards = [
  { icon: <FiFeather size={20} />, title: 'Resume Intelligence', description: 'Upload resume and get instant skill and project insights.' },
  { icon: <FiShield size={20} />, title: 'Adaptive Interview', description: 'Dynamic questions that grow with your answers and confidence.' },
  { icon: <FiArrowRight size={20} />, title: 'Premium Feedback', description: 'Score, strengths, and a polished interview summary report.' },
];

const LandingPage = () => {
  return (
    <main className="relative overflow-hidden px-6 py-10 lg:px-16">
      <div className="absolute inset-0 bg-glass blur-3xl opacity-70" />
      <div className="relative mx-auto max-w-7xl">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100 backdrop-blur">
              AI Interview Lab
            </span>
            <h1 className="mt-8 text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl">
              Build confidence with an AI interviewer that adapts to your resume.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Transform your interview prep with career-aware questions, live evaluation, and automated feedback. The system learns from your resume, your answers, and your evolving confidence.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/auth" className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-glow shadow-violet-500/30 transition hover:-translate-y-1 hover:bg-violet-400">
                Start a session
              </Link>
              <Link to="/upload" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">
                Upload resume
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-glow">
            <div className="absolute -right-10 top-6 h-20 w-20 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Interview preview</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Live AI agent</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Follow up questions, scenario-based prompts, and resume validation in a polished conversation experience.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card) => (
                  <FeatureCard key={card.title} icon={card.icon} title={card.title} description={card.description} />
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
