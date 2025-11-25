
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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
  );

  return (
    <AdminLayout>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Platform overview and metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
            <StatCard title="Submissions" value={stats.totalSubmissions} icon={FileText} color="bg-purple-500" />
            <StatCard title="Total Votes" value={stats.totalVotes} icon={TrendingUp} color="bg-green-500" />
            <StatCard title="Active Builders" value={stats.activeBuilders} icon={Activity} color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Visitor Traffic</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#f9fafb'}} 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                            />
                            <Bar dataKey="visits" fill="#0052FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xs font-bold">1</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">New submission: "DeFi Aggregator"</p>
                            <p className="text-xs text-gray-500">2 minutes ago by Alice Builder</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xs font-bold">2</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">User Verified: Bob Creator</p>
                            <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                    </div>
                     <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xs font-bold">3</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Spike in traffic (US Region)</p>
                            <p className="text-xs text-gray-500">3 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
