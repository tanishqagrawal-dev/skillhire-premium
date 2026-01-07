import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import { Cpu } from 'lucide-react';

const LoginScreen = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse"></div>
    <div className="glass-card p-10 max-w-md w-full relative z-10 text-center border-slate-700/50">
      <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/10">
        <Cpu className="w-10 h-10 text-cyan-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">SkillGap AI</h1>
      <p className="text-slate-400 mb-8">Advanced Career Intelligence Platform</p>
      
      <button 
        onClick={onLogin}
        className="w-full flex items-center justify-center space-x-3 bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all hover:scale-[1.02]"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
        <span>Continue with Google</span>
      </button>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setUser({ name: "Alex Johnson", email: "alex@skillgap.ai", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" });
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <Router>
      <div className="flex min-h-screen text-slate-200">
        <Sidebar logout={() => setUser(null)} />
        <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10 relative overflow-hidden">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <img src={user.photo} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-600 cursor-pointer hover:border-cyan-400 transition" />
          </header>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

