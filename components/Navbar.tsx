
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className={`text-sm font-semibold transition-all duration-200 ${
        isActive(to) 
        ? 'text-base-blue drop-shadow-sm' 
        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
      }`}
      onClick={() => setIsOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/60 glass border-b border-gray-200/50 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
                <Logo className="w-10 h-10 rounded-xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-black dark:text-white transition-colors">Based<span className="text-base-blue">.</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/leaderboard" label="Leaderboard" />
            <NavLink to="/submit" label="Submit" />
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:scale-105 transition-all"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-white/10">
                <Link to="/profile">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/10 transition-all cursor-pointer group">
                        <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{user.name}</span>
                    </div>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10">
                    <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:opacity-80 transition-all shadow-lg hover:-translate-y-0.5">
                  Log In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-white/10 shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <NavLink to="/" label="Home" />
              <NavLink to="/leaderboard" label="Leaderboard" />
              <NavLink to="/submit" label="Submit" />
              {user ? (
                 <>
                    <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
                    <Link to="/profile" className="flex items-center gap-3 px-2 py-2" onClick={() => setIsOpen(false)}>
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-gray-900 dark:text-white">My Profile</span>
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left px-2 text-sm font-medium text-red-500 hover:text-red-400">
                        Log Out
                    </button>
                 </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="pt-2">
                    <button className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold">
                        Log In
                    </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
