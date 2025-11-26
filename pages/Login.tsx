
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, PenTool, Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Role, 2: Details
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupStep1 = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setSignupStep(2);
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
        setError('Email and password are required.');
        return;
    }
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
        if (result.role === UserRole.ADMIN) {
            navigate('/admin/dashboard');
        } else {
            navigate('/profile');
        }
    } else {
        setError(result.message);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signupStep === 2) {
        // Validation
        if (!name.trim() || !email.trim() || !password.trim() || !role) {
            setError('All fields are required.');
            return;
        }

        setIsLoading(true);
        // Direct registration 
        const result = await register(name, email, password, role);
        setIsLoading(false);

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
    }
  };

  const InputField = ({ icon: Icon, type, value, onChange, placeholder, label }: any) => (
      <div>
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-base-blue transition-colors" size={20} />
            <input 
                type={type} 
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-black focus:border-base-blue focus:ring-4 focus:ring-base-blue/10 outline-none transition-all text-black dark:text-white placeholder-gray-400 font-medium shadow-sm"
                placeholder={placeholder}
            />
        </div>
      </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-28 bg-gray-50 dark:bg-black transition-colors duration-500">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[480px] w-full bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-2xl p-8 md:p-12 relative overflow-hidden"
      >
        <div className="flex justify-center mb-8">
            <Logo className="w-14 h-14 rounded-2xl" />
        </div>

        <AnimatePresence mode="wait">
            {!isSignup ? (
                // LOGIN FORM
                <motion.div 
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400">Log in to continue your journey.</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <InputField icon={Mail} type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" label="Email" />
                        <InputField icon={Lock} type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" label="Password" />
                        
                        {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-xl">{error}</p>}
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:opacity-80 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            New to Based? <button onClick={() => setIsSignup(true)} className="text-black dark:text-white font-bold hover:underline">Create Account</button>
                        </p>
                    </div>
                </motion.div>
            ) : (
                // SIGNUP FLOW
                <motion.div 
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    {signupStep === 1 ? (
                        // Step 1: Role Selection
                        <div>
                             <button onClick={() => setIsSignup(false)} className="absolute top-8 left-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Choose Path</h2>
                                <p className="text-gray-500 dark:text-gray-400">How will you contribute?</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => handleSignupStep1(UserRole.BUILDER)}
                                    className="group relative p-6 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-base-blue dark:hover:border-base-blue bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#1A1A1A] transition-all text-left shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-base-blue mb-4 group-hover:scale-110 transition-transform">
                                        <PenTool size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-black dark:text-white">Builder</h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">I ship code, apps, and tools on Base.</p>
                                </button>
                                <button 
                                    onClick={() => handleSignupStep1(UserRole.CREATOR)}
                                    className="group relative p-6 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#1A1A1A] transition-all text-left shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                        <User size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-black dark:text-white">Creator</h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">I create art, content, and community.</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Step 2: Details
                        <div>
                            <button onClick={() => setSignupStep(1)} className="absolute top-8 left-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Create Profile</h2>
                                <p className="text-gray-500">Joining as a <span className="font-bold text-black dark:text-white">{role}</span></p>
                            </div>
                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                <InputField icon={User} type="text" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Satoshi" label="Display Name" />
                                <InputField icon={Mail} type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" label="Email" />
                                <InputField icon={Lock} type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" label="Password" />
                                
                                {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-xl">{error}</p>}
                                
                                <button type="submit" disabled={isLoading} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:opacity-80 transition-all shadow-lg hover:-translate-y-1 mt-4 disabled:opacity-50">
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
