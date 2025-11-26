
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
  
  const filteredSubmissions = useMemo(() => {
    return allSubmissions
        .filter(s => {
            const submitter = allUsers.find(u => u.id === s.userId);
            // EXCLUDE banned users or users that don't exist
            if (!submitter || submitter.isBanned) return false;

            return s.weekId === weekId && (s.category === activeTab || (!s.category && activeTab === UserRole.BUILDER));
        })
        .sort((a, b) => b.votes - a.votes);
  }, [allSubmissions, weekId, activeTab, allUsers]);

  const handleVote = (id: string) => {
    const result = voteForSubmission(id);
    if (!result.success) {
        alert(result.message);
    }
  };

  const getSubmitter = (userId: string) => allUsers.find(u => u.id === userId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 bg-base-light dark:bg-black min-h-screen transition-colors duration-500">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4 px-4 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full shadow-sm"
            >
                <Flame className="text-base-blue fill-base-blue" size={14} />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wide uppercase">Week 1 Live</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter mb-4">
                Weekly Top
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-lg mb-8 font-medium">
                Discover what's being built on Base this week.
                {user && (
                    <span className="block mt-2 text-base-blue font-bold">
                        {Math.max(0, 2 - userVotesThisWeek)} votes remaining.
                    </span>
                )}
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center gap-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-black dark:text-white px-8 py-4 rounded-[2rem] shadow-xl dark:shadow-none">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-white/10 pr-6">
                    <Timer size={18} /> Ends In
                </div>
                <div className="flex gap-6 font-mono font-bold text-xl md:text-2xl tracking-widest">
                    <div className="text-center">
                        <span>{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-400 font-sans font-normal uppercase -mt-1">Days</span>
                    </div>
                    <span className="opacity-30">:</span>
                    <div className="text-center">
                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-400 font-sans font-normal uppercase -mt-1">Hrs</span>
                    </div>
                    <span className="opacity-30">:</span>
                    <div className="text-center">
                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-400 font-sans font-normal uppercase -mt-1">Mins</span>
                    </div>
                    <span className="opacity-30">:</span>
                    <div className="text-center">
                        <span className="text-base-blue">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-[10px] block text-gray-400 font-sans font-normal uppercase -mt-1">Secs</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
            <div className="bg-gray-200 dark:bg-white/10 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                <button 
                    onClick={() => setActiveTab(UserRole.BUILDER)}
                    className={`px-10 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === UserRole.BUILDER 
                        ? 'bg-white dark:bg-[#222] text-black dark:text-white shadow-lg' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                >
                    Builders
                </button>
                <button 
                    onClick={() => setActiveTab(UserRole.CREATOR)}
                    className={`px-10 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === UserRole.CREATOR 
                        ? 'bg-white dark:bg-[#222] text-black dark:text-white shadow-lg' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                >
                    Creators
                </button>
            </div>
        </div>

        {/* Main List Container */}
        <motion.div 
            layout
            className="bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-2xl dark:shadow-none overflow-hidden min-h-[500px] ring-1 ring-black/5 dark:ring-white/5"
        >
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                <div className="col-span-7 md:col-span-9 pl-4">Entry</div>
                <div className="col-span-3 md:col-span-2 text-right pr-4">Votes</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredSubmissions.length === 0 ? (
                    <div className="py-32 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-gray-400">
                            <Trophy size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">No entries yet</h3>
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
        
        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 gap-3 opacity-30">
             <span className="w-2.5 h-2.5 rounded-full bg-base-blue"></span>
             <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
             <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
        </div>
    </div>
  );
};

export default Leaderboard;
