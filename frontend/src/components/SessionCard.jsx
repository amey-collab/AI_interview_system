const SessionCard = ({ session }) => {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-sm transition hover:-translate-y-1 hover:border-violet-400">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Session created</p>
          <p className="mt-2 text-2xl font-semibold text-white">{new Date(session.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="rounded-full bg-slate-950/90 px-4 py-2 text-sm text-slate-300">{session.history.length} questions</div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
          <p className="text-slate-400">Resume skills</p>
          <p className="mt-2 text-white">{session.extractedData.skills?.slice(0, 4).join(', ') || 'N/A'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
          <p className="text-slate-400">Projects</p>
          <p className="mt-2 text-white">{session.extractedData.projects?.slice(0, 2).join(', ') || 'N/A'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
          <p className="text-slate-400">Tech stack</p>
          <p className="mt-2 text-white">{session.extractedData.technologies?.slice(0, 5).join(', ') || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
