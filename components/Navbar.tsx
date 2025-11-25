import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// TODO: Replace this URL with the actual path to your uploaded logo file (e.g., '/logo.png')
const LOGO_URL = "https://placehold.co/200x200/0052FF/FFFFFF?text=Based"; 

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive(to) ? 'text-base-blue' : 'text-gray-600 hover:text-black'
      }`}
      onClick={() => setIsOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
                <div className="absolute inset-0 bg-base-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                    src={LOGO_URL} 
                    alt="Based Logo" 
                    className="relative w-10 h-10 rounded-xl object-cover shadow-sm border border-white/50 group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <span className="text-2xl font-black tracking-tighter text-black group-hover:text-base-blue transition-colors">Based.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/leaderboard" label="Leaderboard" />
            <NavLink to="/submit" label="Submit" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-transparent transition-all cursor-pointer">
                        <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                    </div>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                    <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-black/10">
                  Log In / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
            className="md:hidden overflow-hidden bg-white border-b border-gray-100 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <NavLink to="/" label="Home" />
              <NavLink to="/leaderboard" label="Leaderboard" />
              <NavLink to="/submit" label="Submit" />
              {user ? (
                 <>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <Link to="/profile" className="flex items-center gap-3 px-2 py-2" onClick={() => setIsOpen(false)}>
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-gray-900">My Profile</span>
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left px-2 text-sm font-medium text-red-500 hover:text-red-600">
                        Log Out
                    </button>
                 </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="pt-2">
                    <button className="w-full py-3 bg-black text-white rounded-xl font-bold">
                        Log In / Sign Up
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