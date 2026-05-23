import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import ResumeDropzone from '../components/ResumeDropzone.jsx';
import GlassCard from '../components/GlassCard.jsx';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Drag PDF or DOCX here');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (targetFile) => {
    setError('');
    if (!targetFile) return;
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(targetFile.type)) {
      setError('Only PDF or DOCX files are supported.');
      return;
    }
    setFile(targetFile);
    setStatus(targetFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please attach a resume.');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await api.post('/resume/upload', formData);
      navigate(`/interview/${response.data.sessionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 lg:px-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl">
        <GlassCard>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Resume analyzer</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Upload your resume and start a tailored AI interview.</h1>
              <p className="mt-3 text-slate-400">The AI reads your experience, extracts skills, and generates personalized questions in real time.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ResumeDropzone status={status} error={error} onFileSelect={handleFile} />
            <button type="submit" disabled={loading} className="w-full rounded-full bg-violet-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700">
              {loading ? 'Analyzing resume...' : 'Upload resume and begin'}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </main>
  );
};

export default ResumeUpload;
