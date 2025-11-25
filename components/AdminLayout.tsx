import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

// TODO: Replace with your actual logo URL
const LOGO_URL = "https://placehold.co/200x200/0052FF/FFFFFF?text=Based"; 

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white fixed h-full z-50 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="w-10 h-10 rounded-xl object-cover border border-white/10" 
          />
          <div>
             <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Based<span className="text-base-blue">.Admin</span></h1>
             <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">Platform Control</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
            <Link 
                to="/admin/dashboard" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/dashboard') 
                    ? 'bg-base-blue text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
                <LayoutDashboard size={20} />
                <span className="font-medium">Overview</span>
            </Link>
            
            <Link 
                to="/admin/users" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/users') 
                    ? 'bg-base-blue text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
                <Users size={20} />
                <span className="font-medium">User Management</span>
            </Link>

            <Link 
                to="/admin/content" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/content') 
                    ? 'bg-base-blue text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
                <FileText size={20} />
                <span className="font-medium">Content</span>
            </Link>

            <Link 
                to="/admin/settings" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/settings') 
                    ? 'bg-base-blue text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
            </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-black/50">
            <div className="flex items-center gap-3 mb-4 px-2">
                <img src={user?.avatarUrl} alt="Admin" className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600" />
                <div className="text-sm overflow-hidden">
                    <div className="font-bold text-white truncate">{user?.name}</div>
                    <div className="text-gray-500 text-xs truncate">Super Admin</div>
                </div>
            </div>
            <button 
                onClick={logout} 
                className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full px-2 py-3 rounded-xl text-sm transition-all font-medium"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;