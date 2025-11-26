
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import SubmissionCard from '../components/SubmissionCard';

const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { submissions, allUsers, voteForSubmission, user } = useAuth();
  const navigate = useNavigate();

  const submission = submissions.find(s => s.id === id);
  const submitter = submission ? allUsers.find(u => u.id === submission.userId) : undefined;

  if (!submission) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-light dark:bg-black text-black dark:text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Submission not found</h2>
                <button onClick={() => navigate('/leaderboard')} className="text-base-blue hover:underline">
                    Go to Leaderboard
                </button>
            </div>
        </div>
    );
  }

  const handleVote = (subId: string) => {
      const result = voteForSubmission(subId);
      if (!result.success) alert(result.message);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32 bg-base-light dark:bg-black min-h-screen transition-colors duration-500 flex flex-col items-center">
        <div className="w-full">
            <button 
                onClick={() => navigate('/leaderboard')} 
                className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Leaderboard
            </button>

            <h1 className="text-3xl font-black text-black dark:text-white mb-8 text-center">Project Details</h1>

            <SubmissionCard 
                submission={submission}
                submitter={submitter}
                rank={0}
                hasVoted={false} 
                isOwner={user?.id === submission.userId}
                onVote={handleVote}
                variant="card"
            />
        </div>
    </div>
  );
};

export default SubmissionDetail;
