import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, AlignLeft, Send, PenTool, User } from 'lucide-react';
import { UserRole } from '../types';

const Submit: React.FC = () => {
  const { user, submitEntry } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState<UserRole>(UserRole.BUILDER);
  const [formData, setFormData] = useState({
    description: '',
    link: '',
  });

  if (!user) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 text-center px-4">
            <h2 className="text-2xl font-black mb-4 text-white">You need an account to submit.</h2>
            <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
                Log In / Sign Up
            </button>
        </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-generate a title/image to satisfy the type requirement since we removed the input
    const result = submitEntry({
        ...formData,
        category,
        title: "Project Submission", 
        imageUrl: ""
    });
    
    if (result.success) {
        navigate('/leaderboard');
    } else {
        alert(result.message);
    }
  };

  const isBuilder = category === UserRole.BUILDER;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2">Ship It.</h1>
            <p className="text-gray-400 text-lg">Submit your weekly entry to the leaderboard.</p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-sm">
                <button 
                    onClick={() => setCategory(UserRole.BUILDER)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        isBuilder
                        ? 'bg-base-blue text-white shadow-[0_0_15px_rgba(0,82,255,0.5)]' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                >
                    <PenTool size={16} />
                    Builder
                </button>
                <button 
                    onClick={() => setCategory(UserRole.CREATOR)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        !isBuilder
                        ? 'bg-base-blue text-white shadow-[0_0_15px_rgba(0,82,255,0.5)]' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                >
                    <User size={16} />
                    Creator
                </button>
            </div>
        </div>

        <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit} 
            className="space-y-6 bg-[#0A0A0A]/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-2 pl-1">
                    <Link2 size={16} /> {isBuilder ? "Project Link" : "Content Link"}
                </label>
                <input 
                    type="url" 
                    required
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-base-blue focus:ring-1 focus:ring-base-blue outline-none transition-all font-medium text-white placeholder-gray-600"
                    placeholder={isBuilder ? "https://github.com/..." : "https://twitter.com/..."}
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-2 pl-1">
                    <AlignLeft size={16} /> {isBuilder ? "What did you build?" : "Tell us about the content"}
                </label>
                <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-base-blue focus:ring-1 focus:ring-base-blue outline-none resize-none transition-all text-white placeholder-gray-600"
                    placeholder={isBuilder ? "Describe your progress this week..." : "Describe your art, video, or thread..."}
                />
            </div>

            <button type="submit" className="group w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                Submit to {isBuilder ? "Builders" : "Creators"}
            </button>
        </motion.form>
    </div>
  );
};

export default Submit;