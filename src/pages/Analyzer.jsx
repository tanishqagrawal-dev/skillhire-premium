
import React, { useState } from 'react';
import { Upload, Zap, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Analyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulating AI Processing Time
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 82,
        role: "Frontend Engineer",
        missing: ["Docker", "Kubernetes", "TypeScript"],
        found: ["React", "Node.js", "Tailwind CSS", "Git"]
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {!result ? (
        <div className="glass-card max-w-xl w-full text-center p-10">
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-slate-700">
            <Zap className={`w-10 h-10 text-cyan-400 ${analyzing ? 'animate-bounce' : ''}`} />
            {analyzing && <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            {analyzing ? "AI is Analyzing..." : "Resume Intelligence"}
          </h2>
          <p className="text-slate-400 mb-8">
            Upload your resume and the Job Description. Our model will cross-reference 50+ ATS parameters.
          </p>
          
          <button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
          >
            {analyzing ? "Processing Neural Net..." : "Start Analysis"}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
              <p className="text-cyan-400 text-sm">Target: {result.role}</p>
            </div>
            <div className="text-right">
              <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                {result.score}
              </span>
              <span className="block text-xs text-slate-500 uppercase tracking-wider">Match Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-xl">
              <h4 className="text-green-400 font-bold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2"/> Matches Found
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.found.map(s => (
                  <span key={s} className="text-xs font-medium bg-green-500/20 text-green-300 px-3 py-1.5 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl">
              <h4 className="text-red-400 font-bold mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2"/> Critical Gaps
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing.map(s => (
                  <span key={s} className="text-xs font-medium bg-red-500/20 text-red-300 px-3 py-1.5 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setResult(null)} className="mt-8 text-slate-400 hover:text-white text-sm underline w-full text-center">
            Run New Analysis
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Analyzer;
