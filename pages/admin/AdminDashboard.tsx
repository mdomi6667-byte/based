import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { StorageService } from '../../services/storage';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard: React.FC = () => {
  const stats = StorageService.getStats();

  const chartData = [
    { name: 'Mon', visits: 4000 },
    { name: 'Tue', visits: 3000 },
    { name: 'Wed', visits: 2000 },
    { name: 'Thu', visits: 2780 },
    { name: 'Fri', visits: 1890 },
    { name: 'Sat', visits: 2390 },
    { name: 'Sun', visits: 3490 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
  );

  return (
    <AdminLayout>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Platform overview and metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
            <StatCard title="Submissions" value={stats.totalSubmissions} icon={FileText} color="bg-purple-500" />
            <StatCard title="Total Votes" value={stats.totalVotes} icon={TrendingUp} color="bg-green-500" />
            <StatCard title="Active Builders" value={stats.activeBuilders} icon={Activity} color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 shadow-sm">
                <h3 className="font-bold text-white mb-6">Visitor Traffic</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#333'}} 
                                contentStyle={{borderRadius: '8px', border: 'none', background: '#222', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'}}
                            />
                            <Bar dataKey="visits" fill="#0052FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 shadow-sm flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>More analytics coming soon...</p>
                </div>
            </div>
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;