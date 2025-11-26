
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Twitter, Send, Award, Wallet, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SubmissionCard from '../components/SubmissionCard';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { allUsers, submissions, voteForSubmission, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const profileUser = allUsers.find(u => u.id === userId);

  if (!profileUser) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-light dark:bg-black text-black dark:text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">User not found</h2>
                <button onClick={() => navigate('/leaderboard')} className="text-base-blue hover:underline">
                    Back to Leaderboard
                </button>
            </div>
        </div>
    );
  }

  // Filter submissions for this user
  const userSubmissions = submissions
    .filter(s => s.userId === profileUser.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pt-32 bg-base-light dark:bg-black min-h-screen transition-colors duration-500">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors"
        >
            <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity */}
            <div className="lg:col-span-1 space-y-6">
                {/* ID Card */}
                <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none text-center relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40"></div>
                    <div className="relative z-10 pt-10">
                         <img 
                            src={profileUser.avatarUrl} 
                            alt={profileUser.name} 
                            className="w-32 h-32 rounded-3xl mx-auto border-4 border-white dark:border-[#111] shadow-lg mb-4 object-cover bg-gray-100 dark:bg-black" 
                         />
                        
                        <h2 className="text-2xl font-black text-black dark:text-white mb-1">{profileUser.name}</h2>
                        
                        <div className="flex justify-center gap-2 mb-6">
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {profileUser.role}
                            </span>
                             {profileUser.isBanned && (
                                <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-bold text-red-500 uppercase tracking-wider">
                                    Banned
                                </span>
                            )}
                        </div>

                        {/* Social Links Display */}
                        <div className="flex justify-center gap-3">
                            {profileUser.twitter && (
                                <a href={`https://twitter.com/${profileUser.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-[#1DA1F2]/10 transition-colors">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {profileUser.telegram && (
                                <a href={`https://t.me/${profileUser.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-[#0088cc] hover:bg-blue-50 dark:hover:bg-[#0088cc]/10 transition-colors">
                                    <Send size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                        <Award className="text-yellow-500" /> Achievements
                    </h3>
                    
                    {!profileUser.badges || profileUser.badges.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            <p>No badges earned yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {profileUser.badges.map((badge) => (
                                <div key={badge.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent">
                                    <div className="text-2xl">{badge.icon}</div>
                                    <div>
                                        <div className="font-bold text-black dark:text-white text-sm">{badge.name}</div>
                                        <div className="text-xs text-gray-500">{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Details & History */}
            <div className="lg:col-span-2 space-y-8">
                {/* About & Wallet Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none"
                >
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-black dark:text-white mb-4">About</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {profileUser.about || "No bio yet."}
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            <Wallet size={14} /> Wallet Address
                        </label>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 font-mono text-sm truncate select-all">
                            {profileUser.walletAddress || "Not connected"}
                        </div>
                    </div>
                </motion.div>

                {/* Submission History */}
                <div>
                    <h3 className="text-2xl font-black text-black dark:text-white mb-6 px-2">Recent Submissions</h3>
                    <div className="space-y-4">
                        {userSubmissions.length === 0 ? (
                            <div className="bg-white dark:bg-[#111] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/10 text-center text-gray-500">
                                No submissions yet.
                            </div>
                        ) : (
                            <AnimatePresence>
                                {userSubmissions.map((sub, index) => (
                                    <SubmissionCard
                                        key={sub.id}
                                        submission={sub}
                                        submitter={profileUser}
                                        rank={0}
                                        hasVoted={false} 
                                        isOwner={currentUser?.id === sub.userId}
                                        onVote={(id) => {
                                             const res = voteForSubmission(id);
                                             if(!res.success) alert(res.message);
                                        }}
                                        variant="card"
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PublicProfile;
