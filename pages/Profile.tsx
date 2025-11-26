
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Twitter, Send, Edit2, Save, Upload, Camera, Award, Wallet, Link2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SubmissionCard from '../components/SubmissionCard';

const Profile: React.FC = () => {
  const { user, updateProfile, submissions, voteForSubmission } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="p-10 text-center pt-32 text-white">Please login to view your profile.</div>;

  const handleEdit = () => {
    setEditForm({
        name: user.name,
        about: user.about || '',
        twitter: user.twitter || '',
        telegram: user.telegram || '',
        farcasterLink: user.farcasterLink || '',
        avatarUrl: user.avatarUrl || '',
        walletAddress: user.walletAddress || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert("File is too large. Please select an image under 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter submissions for current user
  const mySubmissions = submissions.filter(s => s.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pt-32 bg-base-light dark:bg-black min-h-screen transition-colors duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity */}
            <div className="lg:col-span-1 space-y-6">
                {/* ID Card */}
                <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none text-center relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40"></div>
                    <div className="relative z-10 pt-10">
                        <div className="relative inline-block group">
                             <img 
                                src={isEditing ? (editForm.avatarUrl || user.avatarUrl) : user.avatarUrl} 
                                alt={user.name} 
                                className="w-32 h-32 rounded-3xl mx-auto border-4 border-white dark:border-[#111] shadow-lg mb-4 object-cover bg-gray-100 dark:bg-black transition-all" 
                             />
                             {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70"
                                        title="Upload Image"
                                    >
                                        <Camera size={20} />
                                    </button>
                                </div>
                             )}
                        </div>
                        
                        {isEditing ? (
                             <div className="mb-4 px-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Display Name</label>
                                <input 
                                    className="w-full text-center text-xl font-bold text-black dark:text-white border-b-2 border-gray-200 dark:border-white/10 focus:border-base-blue outline-none bg-transparent pb-1"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                />
                             </div>
                        ) : (
                            <h2 className="text-2xl font-black text-black dark:text-white mb-1">{user.name}</h2>
                        )}
                        
                        <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                            {user.role}
                        </div>

                        {/* Social Links Display */}
                        {!isEditing && (
                            <div className="flex justify-center gap-3 mb-6">
                                {user.twitter && (
                                    <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-[#1DA1F2]/10 transition-colors">
                                        <Twitter size={18} />
                                    </a>
                                )}
                                {user.telegram && (
                                    <a href={`https://t.me/${user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-[#0088cc] hover:bg-blue-50 dark:hover:bg-[#0088cc]/10 transition-colors">
                                        <Send size={18} />
                                    </a>
                                )}
                            </div>
                        )}

                        <button 
                            onClick={isEditing ? handleSave : handleEdit}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                                isEditing 
                                ? 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02]' 
                                : 'bg-gray-100 dark:bg-white/10 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                            }`}
                        >
                            {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
                        </button>
                        
                        {/* Hidden File Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                </div>

                {/* Badges Section */}
                <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                        <Award className="text-yellow-500" /> Achievements
                    </h3>
                    
                    {!user.badges || user.badges.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            <p>No badges earned yet.</p>
                            <p className="mt-1">Rank in the top 3 to earn.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {user.badges.map((badge) => (
                                <div key={badge.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors">
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
                    layout
                    className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none"
                >
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-black dark:text-white mb-4">About</h3>
                        {isEditing ? (
                            <textarea 
                                className="w-full h-32 p-4 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 focus:border-base-blue outline-none transition-all text-black dark:text-white resize-none"
                                placeholder="Tell us about yourself..."
                                value={editForm.about}
                                onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                            />
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {user.about || "No bio yet."}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Wallet Address */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Wallet size={14} /> Wallet Address
                            </label>
                            {isEditing ? (
                                <input 
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 focus:border-base-blue outline-none text-black dark:text-white font-mono text-sm"
                                    placeholder="0x..."
                                    value={editForm.walletAddress}
                                    onChange={(e) => setEditForm({...editForm, walletAddress: e.target.value})}
                                />
                            ) : (
                                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 font-mono text-sm truncate select-all">
                                    {user.walletAddress || "Not connected"}
                                </div>
                            )}
                        </div>

                        {/* Social Handles Inputs (Only visible in edit) */}
                        {isEditing && (
                            <>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        <Twitter size={14} /> Twitter Username
                                    </label>
                                    <input 
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 focus:border-base-blue outline-none text-black dark:text-white text-sm"
                                        placeholder="@username"
                                        value={editForm.twitter}
                                        onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        <Send size={14} /> Telegram Username
                                    </label>
                                    <input 
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 focus:border-base-blue outline-none text-black dark:text-white text-sm"
                                        placeholder="@username"
                                        value={editForm.telegram}
                                        onChange={(e) => setEditForm({...editForm, telegram: e.target.value})}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Submission History */}
                <div>
                    <h3 className="text-2xl font-black text-black dark:text-white mb-6 px-2">Submission History</h3>
                    <div className="space-y-4">
                        {mySubmissions.length === 0 ? (
                            <div className="bg-white dark:bg-[#111] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/10 text-center text-gray-500">
                                You haven't submitted anything yet.
                            </div>
                        ) : (
                            <AnimatePresence>
                                {mySubmissions.map((sub, index) => (
                                    <SubmissionCard
                                        key={sub.id}
                                        submission={sub}
                                        submitter={user}
                                        rank={0} // Rank is dynamic on leaderboard, not history
                                        hasVoted={false} 
                                        isOwner={true}
                                        onVote={() => {}} // No voting on own profile history
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

export default Profile;
