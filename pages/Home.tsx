import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Hero Section with Spline 3D Background */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
        {/* Spline Iframe Layer */}
        <div className="absolute inset-0 z-0">
             <iframe 
                src='https://my.spline.design/radialglass-iK4kZjB9QiAnQwSP6iiK4gRE/' 
                frameBorder='0' 
                width='100%' 
                height='100%'
                className="w-full h-full"
                style={{ pointerEvents: 'auto' }} // Enable interaction with 3D model
             ></iframe>
             {/* Overlay for Text Readability & Smooth Transition to White Body */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pointer-events-none">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Week 42 Voting is Live
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-2xl">
                    Based<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    The premier platform for Builders and Creators. <br className="hidden md:block" />
                    <span className="text-white font-medium">Build. Submit. Get Funded.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link to="/leaderboard">
                        <button className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)]">
                            View Leaderboard
                        </button>
                    </Link>
                    <Link to="/submit">
                        <button className="px-10 py-4 bg-black/20 backdrop-blur-xl text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:border-white/40">
                            Submit Project
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Features Grid - Clean White Theme */}
      <section className="py-32 bg-[#FAFAFA] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
                <h2 className="text-3xl font-bold text-black mb-4">Why Based?</h2>
                <p className="text-gray-500">Everything you need to grow your on-chain reputation.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Trophy, title: 'Weekly Leaderboards', desc: 'Top 3 projects every week get featured and earn exclusive badges.' },
                    { icon: Users, title: 'Community Voting', desc: 'Fair voting system. 2 votes per user. No self-voting allowed.' },
                    { icon: Zap, title: 'Builder Profiles', desc: 'Showcase your portfolio, stats, and net worth on your dynamic profile.' }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-black group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                            <feature.icon size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;