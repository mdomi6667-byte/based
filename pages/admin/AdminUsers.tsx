
import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Ban, CheckCircle, Search, Trash2, MoreHorizontal } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { allUsers, toggleBanUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500">Manage access and user roles.</p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-black transition-colors bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'Admin' ? 'bg-black text-white' : 
                                    user.role === 'Builder' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.isBanned ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                        <Ban size={12} /> Banned
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">
                                        <CheckCircle size={12} /> Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(user.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {user.role !== 'Admin' && (
                                        <button 
                                            onClick={() => toggleBanUser(user.id)}
                                            className={`p-2 rounded hover:bg-gray-100 transition-colors ${user.isBanned ? 'text-green-500' : 'text-red-500'}`}
                                            title={user.isBanned ? "Unban User" : "Ban User"}
                                        >
                                            {user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </AdminLayout>
  );
};

export default AdminUsers;
