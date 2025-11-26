import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/10 fixed h-full z-50 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
          <Logo className="w-10 h-10 rounded-xl" />
          <div>
             <h1 className="text-lg font-bold tracking-tight text-black dark:text-white leading-tight">Based<span className="text-base-blue">.Admin</span></h1>
             <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">Platform Control</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
            <Link 
                to="/admin/dashboard" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/dashboard') 
                    ? 'bg-base-blue/10 text-base-blue border border-base-blue/20 translate-x-1' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
            >
                <LayoutDashboard size={20} />
                <span className="font-medium">Overview</span>
            </Link>
            
            <Link 
                to="/admin/users" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/users') 
                    ? 'bg-base-blue/10 text-base-blue border border-base-blue/20 translate-x-1' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
            >
                <Users size={20} />
                <span className="font-medium">User Management</span>
            </Link>

            <Link 
                to="/admin/content" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive('/admin/content') 
                    ? 'bg-base-blue/10 text-base-blue border border-base-blue/20 translate-x-1' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
            >
                <FileText size={20} />
                <span className="font-medium">Content</span>
            </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
            <button 
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 w-full p-2 mb-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 text-sm font-medium shadow-sm hover:scale-[1.02] transition-all"
            >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="flex items-center gap-3 mb-4 px-2">
                <img src={user?.avatarUrl} alt="Admin" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="text-sm overflow-hidden">
                    <div className="font-bold text-black dark:text-white truncate">{user?.name}</div>
                    <div className="text-gray-500 text-xs truncate">Super Admin</div>
                </div>
            </div>
            <button 
                onClick={logout} 
                className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 w-full px-2 py-3 rounded-xl text-sm transition-all font-medium"
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