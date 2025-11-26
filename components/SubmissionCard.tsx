
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Submission, UserProfile } from '../types';
import { ExternalLink, ArrowUp, Crown, ChevronDown, ChevronUp, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SubmissionCardProps {
  submission: Submission;
  submitter?: UserProfile;
  rank: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  isOwner: boolean;
  variant?: 'card' | 'list';
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ 
  submission, 
  submitter,
  rank, 
  hasVoted, 
  onVote, 
  isOwner,
  variant = 'list'
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'card'); // Default expanded if in card mode
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/submission/${submission.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const upvoteVariants: Variants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    voted: { 
        scale: [1, 1.4, 1],
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`group relative bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 ${variant === 'card' ? 'rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-lg' : ''}`}
    >
        <div className="grid grid-cols-12 items-center py-6 px-6">
            {/* Rank Column */}
            <div className="col-span-2 md:col-span-1 flex justify-center">
                {rank > 0 ? (
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                        ${rank === 1 ? 'bg-yellow-400 text-black' : 
                          rank === 2 ? 'bg-gray-300 text-black' : 
                          rank === 3 ? 'bg-orange-400 text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}
                    `}>
                        {rank === 1 ? <Crown size={16} fill="currentColor" /> : rank}
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    </div>
                )}
            </div>

            {/* Content Column */}
            <div className="col-span-7 md:col-span-9 pl-4 flex items-center gap-5 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {/* Avatar */}
                <Link to={`/u/${submitter?.id}`} className="relative flex-shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
                    <img 
                        src={submitter?.avatarUrl} 
                        alt="" 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-sm bg-gray-100 hover:scale-105 transition-transform"
                    />
                </Link>

                {/* Text Info */}
                <div className="min-w-0 flex flex-col justify-center">
                    <Link to={`/u/${submitter?.id}`} className="flex items-center gap-2 mb-0.5 z-10 w-fit" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-base md:text-lg font-bold text-black dark:text-white truncate hover:text-base-blue transition-colors">
                           {submitter?.name || "Anonymous"}
                        </h3>
                    </Link>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate pr-4">
                        {submission.description}
                    </div>
                </div>

                {/* Expand Chevron (Desktop) */}
                <button 
                    className="hidden md:flex ml-auto p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Votes Column */}
            <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-3">
                {/* Share Button */}
                <button 
                    onClick={handleShare}
                    className="p-2.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-base-blue transition-colors relative"
                    title="Share Submission"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                </button>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-black dark:text-white text-lg tabular-nums">
                        {submission.votes}
                    </span>
                    
                    <motion.button 
                        variants={upvoteVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                        animate={hasVoted ? "voted" : "idle"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote(submission.id);
                        }}
                        disabled={isOwner || hasVoted}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
                            hasVoted 
                            ? 'bg-base-blue text-white shadow-blue-500/30'
                            : isOwner 
                                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-white dark:bg-black border border-gray-100 dark:border-white/20 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                        }`}
                    >
                        <ArrowUp size={20} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50 dark:bg-black/40 border-t border-gray-100 dark:border-white/5"
                >
                    <div className="px-6 py-6 pl-[5.5rem] md:pl-32 pr-8">
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                            {submission.description}
                        </p>
                        <a 
                            href={submission.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-base-blue hover:bg-blue-600 transition-colors px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20"
                        >
                            View Project <ExternalLink size={14} />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default SubmissionCard;
