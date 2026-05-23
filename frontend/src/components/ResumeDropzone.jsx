const ResumeDropzone = ({ status, error, onFileSelect }) => (
  <label className="group block rounded-[32px] border border-slate-700/80 bg-slate-950/75 p-10 text-center transition hover:border-violet-400">
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/10">
      <span className="text-4xl">[CV]</span>
    </div>
    <p className="mt-6 text-xl font-semibold text-white">{status}</p>
    <p className="mt-2 text-sm text-slate-400">Drag and drop or choose a PDF / DOCX resume to upload.</p>
    <input type="file" accept=".pdf,.docx" onChange={(e) => onFileSelect(e.target.files?.[0])} className="mt-6 hidden" />
    {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
  </label>
);

export default ResumeDropzone;
