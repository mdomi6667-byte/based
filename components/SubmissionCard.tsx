import React, { useState } from 'react';
import { Submission, UserProfile } from '../types';
import { ExternalLink, ArrowUp, Crown, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation variants for the upvote button
  const upvoteVariants: Variants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.8 },
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
        className="group relative border-b border-gray-100 last:border-0 bg-white/40 hover:bg-white/80 transition-all duration-300"
    >
        <div className="grid grid-cols-12 items-center py-5 px-6">
            {/* Rank Column */}
            <div className="col-span-2 md:col-span-1 flex justify-center">
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                    ${rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white' : 
                      rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' : 
                      rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-200'}
                `}>
                    {rank === 1 ? <Crown size={14} fill="currentColor" /> : rank}
                </div>
            </div>

            {/* Content Column */}
            <div className="col-span-7 md:col-span-9 pl-4 flex items-center gap-4 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <img 
                        src={submitter?.avatarUrl || `https://ui-avatars.com/api/?name=${submitter?.name || 'User'}`} 
                        alt="" 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                </div>

                {/* Text Info */}
                <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-bold text-gray-900 truncate">
                           {submitter?.name || "Anonymous"}
                        </h3>
                    </div>
                    <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <span className="truncate max-w-[200px] text-gray-400">
                             {/* Display a preview of the description since we removed Title */}
                            {submission.description}
                        </span>
                    </div>
                </div>

                {/* Expand Chevron (Mobile/Desktop) */}
                <button 
                    className="ml-2 p-1 text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition-colors"
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Votes Column */}
            <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-3 md:gap-5">
                <span className="font-bold text-gray-900 tabular-nums text-sm md:text-base">
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                        hasVoted 
                        ? 'bg-green-500 text-white shadow-green-200'
                        : isOwner 
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-white text-black hover:bg-black hover:text-white hover:shadow-xl border border-gray-100'
                    }`}
                >
                    <ArrowUp size={18} strokeWidth={3} />
                </motion.button>
            </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50/50"
                >
                    <div className="px-6 py-4 pl-[4.5rem] md:pl-28 pr-6">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {submission.description}
                        </p>
                        <a 
                            href={submission.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-bold text-base-blue hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                            View Project <ExternalLink size={12} />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default SubmissionCard;