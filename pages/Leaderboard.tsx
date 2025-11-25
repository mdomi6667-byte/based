
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrentWeekId, getTimeUntilReset } from '../services/storage';
import SubmissionCard from '../components/SubmissionCard';
import { Flame, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

const Leaderboard: React.FC = () => {
  const { voteForSubmission, user, allUsers, submissions: allSubmissions, userVotesThisWeek } = useAuth();
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.BUILDER);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());
  
  const weekId = getCurrentWeekId();

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Filter submissions by current week AND by the category of the submission
  const filteredSubmissions = useMemo(() => {
    return allSubmissions
        .filter(s => {
            // Check week and submission category (default to Builder if undefined for legacy/safety)
            return s.weekId === weekId && (s.category === activeTab || (!s.category && activeTab === UserRole.BUILDER));
        })
        .sort((a, b) => b.votes - a.votes);
  }, [allSubmissions, weekId, activeTab]);

  const handleVote = (id: string) => {
    const result = voteForSubmission(id);
    if (!result.success) {
        alert(result.message);
    }
  };

  const getSubmitter = (userId: string) => allUsers.find(u => u.id === userId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4 px-4 py-1.5 bg-black/5 backdrop-blur-sm border border-black/5 rounded-full"
            >
                <Flame className="text-orange-500 fill-orange-500" size={14} />
                <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">Week 1 Live</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                Weekly Leaderboard
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto text-lg mb-6">
                Discover what's being built on Base this week.
                {user && (
                    <span className="block mt-2 text-base-blue font-bold">
                        {Math.max(0, 2 - userVotesThisWeek)} votes remaining.
                    </span>
                )}
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4 bg-black text-white px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider border-r border-gray-700 pr-4">
                    <Timer size={18} /> Resets In
                </div>
                <div className="flex gap-4 font-mono font-bold text-lg md:text-xl">
                    <div className="text-center">
                        <span>{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-500 font-sans font-normal uppercase">Days</span>
                    </div>
                    <span>:</span>
                    <div className="text-center">
                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-500 font-sans font-normal uppercase">Hrs</span>
                    </div>
                    <span>:</span>
                    <div className="text-center">
                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-500 font-sans font-normal uppercase">Mins</span>
                    </div>
                    <span>:</span>
                    <div className="text-center">
                        <span className="text-base-blue">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-500 font-sans font-normal uppercase">Secs</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
            <div className="bg-white/50 backdrop-blur-md border border-white/60 p-1.5 rounded-2xl flex gap-1 shadow-sm">
                <button 
                    onClick={() => setActiveTab(UserRole.BUILDER)}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === UserRole.BUILDER 
                        ? 'bg-white text-black shadow-md shadow-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Builders
                </button>
                <button 
                    onClick={() => setActiveTab(UserRole.CREATOR)}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === UserRole.CREATOR 
                        ? 'bg-white text-black shadow-md shadow-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Creators
                </button>
            </div>
        </div>

        {/* Main List Container */}
        <motion.div 
            layout
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden min-h-[500px]"
        >
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-5 border-b border-gray-100/50 bg-white/40 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                <div className="col-span-7 md:col-span-9 pl-4">Builder & Project</div>
                <div className="col-span-3 md:col-span-2 text-right">Votes</div>
            </div>

            <div className="divide-y divide-gray-50">
                {filteredSubmissions.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <Trophy size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No entries yet</h3>
                        <p className="text-gray-500 mt-2">Be the first {activeTab === UserRole.BUILDER ? 'Builder' : 'Creator'} to ship this week.</p>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {filteredSubmissions.map((sub, index) => {
                            const submitter = getSubmitter(sub.userId);
                            return (
                                <SubmissionCard
                                    key={sub.id}
                                    submission={sub}
                                    submitter={submitter}
                                    rank={index + 1}
                                    hasVoted={false} 
                                    isOwner={user?.id === sub.userId}
                                    onVote={handleVote}
                                    variant="list"
                                />
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
            
        </motion.div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2 opacity-50">
             <span className="w-2 h-2 rounded-full bg-black"></span>
             <span className="w-2 h-2 rounded-full bg-gray-300"></span>
             <span className="w-2 h-2 rounded-full bg-gray-300"></span>
        </div>
    </div>
  );
};

export default Leaderboard;
