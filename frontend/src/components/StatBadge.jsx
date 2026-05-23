const StatBadge = ({ label, value, accent }) => (
  <div className="rounded-[28px] border border-slate-700/80 bg-slate-900/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-400">
    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <p className={`mt-4 text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${accent}`}>{value}</p>
  </div>
);

export default StatBadge;
