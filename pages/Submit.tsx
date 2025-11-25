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
            <h2 className="text-2xl font-black mb-4">You need an account to submit.</h2>
            <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-black text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
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
            <h1 className="text-4xl font-black text-gray-900 mb-2">Ship It.</h1>
            <p className="text-gray-500 text-lg">Submit your weekly entry to the leaderboard.</p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-8">
            <div className="bg-white/50 backdrop-blur-md border border-white/60 p-1.5 rounded-2xl flex gap-1 shadow-sm">
                <button 
                    onClick={() => setCategory(UserRole.BUILDER)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        isBuilder
                        ? 'bg-white text-black shadow-md shadow-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    <PenTool size={16} />
                    Builder
                </button>
                <button 
                    onClick={() => setCategory(UserRole.CREATOR)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        !isBuilder
                        ? 'bg-white text-black shadow-md shadow-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
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
            className="space-y-6 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-xl"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 pl-1">
                    <Link2 size={16} /> {isBuilder ? "Project Link" : "Content Link"}
                </label>
                <input 
                    type="url" 
                    required
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium"
                    placeholder={isBuilder ? "https://github.com/..." : "https://twitter.com/..."}
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 pl-1">
                    <AlignLeft size={16} /> {isBuilder ? "What did you build?" : "Tell us about the content"}
                </label>
                <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none resize-none transition-all"
                    placeholder={isBuilder ? "Describe your progress this week..." : "Describe your art, video, or thread..."}
                />
            </div>

            <button type="submit" className="group w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                Submit to {isBuilder ? "Builders" : "Creators"}
            </button>
        </motion.form>
    </div>
  );
};

export default Submit;