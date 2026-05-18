import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle, BookOpen, Trophy } from 'lucide-react';
import api from '../utils/api';

const AIRecommendations = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeesExist, setEmployeesExist] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/recommend', {});
      setInsights(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setEmployeesExist(false);
      } else {
        setError(err.response?.data?.message || 'Failed to generate AI insights. Check API configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (!employeesExist) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
        <p className="text-slate-400 mb-6">Add some employees first to generate AI insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-blue-400" /> AI Insights & Recommendations
          </h1>
          <p className="text-slate-400">Powered by DeepSeek AI model analyzing employee performance data.</p>
        </div>
        
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Generating...</span>
          ) : (
            <span className="flex items-center gap-2"><BrainCircuit size={18} /> Refresh Insights</span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && !insights ? (
        <div className="glass-panel rounded-2xl p-12 border-white/10 border flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={24} />
          </div>
          <h3 className="text-xl font-medium text-white">AI is analyzing performance data...</h3>
          <p className="text-slate-400 text-center max-w-md">Our deep learning model is evaluating skills, experience, and performance scores to generate actionable HR insights.</p>
        </div>
      ) : insights ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Promotions */}
          <div className="glass-panel rounded-2xl p-6 border-emerald-500/20 border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Promotion Candidates</h2>
            </div>
            <div className="space-y-4 relative z-10">
              {insights.promotions && insights.promotions.length > 0 ? insights.promotions.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-semibold text-white text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-300">{item.reason}</p>
                </div>
              )) : <p className="text-slate-400">No promotion candidates identified currently.</p>}
            </div>
          </div>

          {/* Training */}
          <div className="glass-panel rounded-2xl p-6 border-blue-500/20 border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Training Suggestions</h2>
            </div>
            <div className="space-y-4 relative z-10">
              {insights.trainingSuggestions && insights.trainingSuggestions.length > 0 ? insights.trainingSuggestions.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-semibold text-white text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-300">{item.suggestions}</p>
                </div>
              )) : <p className="text-slate-400">No training needs identified currently.</p>}
            </div>
          </div>

          {/* Feedback */}
          <div className="glass-panel rounded-2xl p-6 border-amber-500/20 border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Improvement Feedback</h2>
            </div>
            <div className="space-y-4 relative z-10">
              {insights.improvementFeedback && insights.improvementFeedback.length > 0 ? insights.improvementFeedback.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-semibold text-white text-lg mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-300">{item.feedback}</p>
                </div>
              )) : <p className="text-slate-400">No critical improvement feedback currently.</p>}
            </div>
          </div>

          {/* Rankings */}
          <div className="glass-panel rounded-2xl p-6 border-purple-500/20 border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
                <Trophy size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">AI Value Ranking</h2>
            </div>
            <div className="space-y-3 relative z-10">
              {insights.ranking && insights.ranking.length > 0 ? insights.ranking.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                      idx === 1 ? 'bg-slate-300/20 text-slate-300' : 
                      idx === 2 ? 'bg-amber-700/20 text-amber-500' : 'bg-white/5 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                  </div>
                  <div className="text-blue-400 font-bold">{item.score} <span className="text-xs font-normal text-slate-400">pts</span></div>
                </div>
              )) : <p className="text-slate-400">Ranking not available.</p>}
            </div>
          </div>
          
        </div>
      ) : null}
    </div>
  );
};

export default AIRecommendations;
