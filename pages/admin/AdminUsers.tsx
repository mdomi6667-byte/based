import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';
import { Ban, CheckCircle, Search, Eye, X, Wallet, Twitter, Send, Globe, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers: React.FC = () => {
  const { allUsers, toggleBanUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">User Management</h1>
                <p className="text-gray-500">Manage access, roles, and view user details.</p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search name, email, wallet..." 
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
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 object-cover" />
                                    <div>
                                        <div className="font-bold text-sm text-black dark:text-white">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                                    user.role === 'Admin' ? 'bg-black text-white dark:bg-white dark:text-black' : 
                                    user.role === 'Builder' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.isBanned ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full">
                                        <Ban size={12} /> Banned
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full">
                                        <CheckCircle size={12} /> Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(user.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-base-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    {user.role !== 'Admin' && (
                                        <button 
                                            onClick={() => toggleBanUser(user.id)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                user.isBanned 
                                                ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' 
                                                : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                            }`}
                                            title={user.isBanned ? "Unban User" : "Ban User"}
                                        >
                                            {user.isBanned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Detailed User Modal */}
        <AnimatePresence>
            {selectedUser && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedUser(null)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white dark:bg-[#111] w-full max-w-lg rounded-[2rem] shadow-2xl p-8 border border-gray-100 dark:border-white/10"
                    >
                        <button 
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <img src={selectedUser.avatarUrl} alt="" className="w-24 h-24 rounded-3xl object-cover shadow-lg mb-4 bg-gray-100" />
                            <h2 className="text-2xl font-black text-black dark:text-white">{selectedUser.name}</h2>
                            <span className="text-gray-500">{selectedUser.email}</span>
                            <div className="mt-3 flex gap-2">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                                    {selectedUser.role}
                                </span>
                                {selectedUser.isBanned && (
                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-bold text-red-600 dark:text-red-400">
                                        Suspended
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-base-blue rounded-xl">
                                    <Wallet size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-gray-400 uppercase">Wallet Address</div>
                                    <div className="text-sm font-mono text-black dark:text-white truncate w-full">
                                        {selectedUser.walletAddress || "Not connected"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                                        <Twitter size={14} /> <span className="text-xs font-bold uppercase">Twitter</span>
                                    </div>
                                    <div className="text-sm font-medium text-black dark:text-white truncate">
                                        {selectedUser.twitter || "N/A"}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                                        <Send size={14} /> <span className="text-xs font-bold uppercase">Telegram</span>
                                    </div>
                                    <div className="text-sm font-medium text-black dark:text-white truncate">
                                        {selectedUser.telegram || "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <Globe size={14} /> <span className="text-xs font-bold uppercase">Bio / About</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {selectedUser.about || "No bio provided."}
                                </p>
                            </div>

                             <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar size={14} /> <span className="text-xs font-bold uppercase">Joined</span>
                                </div>
                                <div className="text-sm font-bold text-black dark:text-white">
                                    {new Date(selectedUser.joinedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <a href={`mailto:${selectedUser.email}`} className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-center hover:opacity-80 transition-opacity">
                                Contact User
                            </a>
                            {!selectedUser.isBanned ? (
                                <button 
                                    onClick={() => { toggleBanUser(selectedUser.id); setSelectedUser(null); }}
                                    className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    Ban User
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { toggleBanUser(selectedUser.id); setSelectedUser(null); }}
                                    className="flex-1 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                >
                                    Unban User
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsers;