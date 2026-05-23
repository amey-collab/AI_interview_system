import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import InterviewRoom from './pages/InterviewRoom.jsx';
import Dashboard from './pages/Dashboard.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import useAuth from './hooks/useAuth.jsx';

function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/upload" element={token ? <ResumeUpload /> : <Navigate to="/auth" />} />
        <Route path="/interview/:id" element={token ? <InterviewRoom /> : <Navigate to="/auth" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/history" element={token ? <HistoryPage /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
