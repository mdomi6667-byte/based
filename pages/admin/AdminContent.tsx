import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Search, ExternalLink, Trash2, Ban, AlertTriangle } from 'lucide-react';

const AdminContent: React.FC = () => {
  const { submissions, allUsers, deleteSubmission, toggleBanUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const getSubmitter = (userId: string) => allUsers.find(u => u.id === userId);

  const filteredSubmissions = submissions.filter(s => {
    const submitter = getSubmitter(s.userId);
    const searchString = searchTerm.toLowerCase();
    return (
        s.title?.toLowerCase().includes(searchString) || 
        s.description.toLowerCase().includes(searchString) ||
        submitter?.name.toLowerCase().includes(searchString)
    );
  });

  const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to reject and delete this submission?")) {
          deleteSubmission(id);
      }
  };

  const handleBanAndReject = (submissionId: string, userId: string) => {
      if (confirm("DANGER: This will delete the submission AND BAN the user. Continue?")) {
          deleteSubmission(submissionId);
          const user = getSubmitter(userId);
          if (user && !user.isBanned) {
              toggleBanUser(userId);
          }
      }
  };

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Content Moderation</h1>
                <p className="text-gray-500">Review, reject, and manage user submissions.</p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search submissions..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-base-blue transition-colors bg-white dark:bg-white/5 text-black dark:text-white min-w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Project / Content</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Votes</th>
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {filteredSubmissions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No submissions found.
                            </td>
                        </tr>
                    ) : (
                        filteredSubmissions.map(sub => {
                            const submitter = getSubmitter(sub.userId);
                            return (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="font-bold text-black dark:text-white truncate" title={sub.title}>{sub.title || "Untitled"}</div>
                                        <div className="text-xs text-gray-500 truncate" title={sub.description}>{sub.description}</div>
                                        <a href={sub.link} target="_blank" rel="noopener" className="text-xs text-base-blue hover:underline inline-flex items-center gap-1 mt-1">
                                            View Source <ExternalLink size={10} />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        {submitter ? (
                                            <div className="flex items-center gap-2">
                                                <img src={submitter.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                                                <span className={`text-sm font-medium ${submitter.isBanned ? 'text-red-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {submitter.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Unknown User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-black dark:text-white">{sub.votes}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Reject Submission"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleBanAndReject(sub.id, sub.userId)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                                title="Reject & Ban User"
                                            >
                                                <AlertTriangle size={18} className="group-hover:fill-red-600/20" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    </AdminLayout>
  );
};

export default AdminContent;