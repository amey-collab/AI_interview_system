const FeatureCard = ({ icon, title, description }) => (
  <div className="rounded-3xl border border-slate-700/70 bg-slate-900/75 p-5 transition hover:-translate-y-1 hover:border-violet-400/60">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">{icon}</div>
    <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
  </div>
);

export default FeatureCard;
