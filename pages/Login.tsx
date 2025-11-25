
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, PenTool, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Role, 2: Details, 3: Verification
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { login, register, sendVerificationCode } = useAuth();
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
        // Validation for Step 2
        if (!name.trim() || !email.trim() || !password.trim() || !role) {
            setError('All fields are required.');
            return;
        }

        setIsLoading(true);
        // Send verification code
        const result = await sendVerificationCode(email);
        setIsLoading(false);

        if (result.success && result.code) {
            setGeneratedCode(result.code);
            // MOCK EMAIL SENDING
            setTimeout(() => {
                 alert(`Based App Verification:\n\nYour code is: ${result.code}`);
            }, 500);
            setSignupStep(3);
        } else {
            setError(result.message);
        }

    } else if (signupStep === 3) {
        // Validation for Step 3
        if (verificationCode !== generatedCode) {
            setError('Invalid verification code. Please try again.');
            return;
        }

        setIsLoading(true);
        const result = await register(name, email, password, role!);
        setIsLoading(false);

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
    }
  };

  const handleResendCode = () => {
     alert(`Based App Verification (Resend):\n\nYour code is: ${generatedCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-28">
      <motion.div 
        layout
        className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 relative overflow-hidden"
      >
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
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Log in to continue your journey.</p>
                        <p className="text-xs text-gray-400 mt-4 bg-gray-50 p-2 rounded">
                            Demo Admin: admin@based.com / admin123
                        </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            New to Based? <button onClick={() => setIsSignup(true)} className="text-black font-bold hover:underline">Create Account</button>
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
                             <button onClick={() => setIsSignup(false)} className="absolute top-8 left-8 text-gray-400 hover:text-black">
                                <ArrowLeft size={20} />
                            </button>
                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Choose your Path</h2>
                                <p className="text-gray-500">How will you contribute?</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => handleSignupStep1(UserRole.BUILDER)}
                                    className="group relative p-6 rounded-2xl border-2 border-gray-100 hover:border-base-blue hover:bg-blue-50/50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-base-blue mb-4 group-hover:scale-110 transition-transform">
                                        <PenTool size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Builder</h3>
                                    <p className="text-sm text-gray-500 mt-1">I ship code, apps, and tools on Base.</p>
                                </button>
                                <button 
                                    onClick={() => handleSignupStep1(UserRole.CREATOR)}
                                    className="group relative p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                        <User size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Creator</h3>
                                    <p className="text-sm text-gray-500 mt-1">I create art, content, and community.</p>
                                </button>
                            </div>
                        </div>
                    ) : signupStep === 2 ? (
                        // Step 2: Details
                        <div>
                            <button onClick={() => setSignupStep(1)} className="absolute top-8 left-8 text-gray-400 hover:text-black">
                                <ArrowLeft size={20} />
                            </button>
                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Create Profile</h2>
                                <p className="text-gray-500">Joining as a <span className="font-bold text-black">{role}</span></p>
                            </div>
                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="Satoshi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                                <button type="submit" disabled={isLoading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                                    {isLoading ? "Sending Code..." : "Verify & Continue"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        // Step 3: Verification
                        <div>
                            <button onClick={() => setSignupStep(2)} className="absolute top-8 left-8 text-gray-400 hover:text-black">
                                <ArrowLeft size={20} />
                            </button>
                            <div className="text-center mb-8 mt-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Check your Email</h2>
                                <p className="text-gray-500 text-sm">
                                    We sent a code to <span className="font-bold text-black">{email}</span>
                                </p>
                            </div>
                            
                            <form onSubmit={handleSignupSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Verification Code</label>
                                    <input 
                                        type="text" 
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                        className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="000000"
                                    />
                                </div>
                                
                                <div className="text-center">
                                    <button 
                                        type="button" 
                                        onClick={handleResendCode}
                                        className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                                    >
                                        Didn't receive code? Resend
                                    </button>
                                </div>

                                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                                
                                <button type="submit" disabled={isLoading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                                    {isLoading ? "Creating Account..." : "Verify & Create Account"}
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
