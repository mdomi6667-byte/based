
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-light dark:bg-black transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Effects - Adaptive */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Light Mode Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm font-semibold mb-8 shadow-sm dark:shadow-none">
                    <span className="w-2 h-2 rounded-full bg-base-blue animate-pulse"></span>
                    Week 42 Voting is Live
                </div>
                
                <h1 className="text-7xl md:text-9xl font-black text-black dark:text-white tracking-tighter mb-8 drop-shadow-sm dark:drop-shadow-2xl">
                    Based<span className="text-base-blue">.</span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-normal tracking-tight">
                    The premier platform for Builders and Creators. <br className="hidden md:block" />
                    <span className="text-black dark:text-white font-semibold">Build. Submit. Get Funded. Get Recognized.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link to="/leaderboard">
                        <button className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:opacity-80 transition-all hover:scale-105 shadow-2xl shadow-black/20 dark:shadow-white/10">
                            View Leaderboard
                        </button>
                    </Link>
                    <Link to="/submit">
                        <button className="px-12 py-5 bg-white/60 dark:bg-white/5 backdrop-blur-xl text-black dark:text-white border border-gray-200 dark:border-white/10 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                            Submit Project
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Vision / Features Grid */}
      <section className="py-32 bg-white dark:bg-[#0A0A0A] relative z-10 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.05)] dark:shadow-none border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-black dark:text-white mb-4 tracking-tight">Why Based?</h2>
                <p className="text-xl text-gray-500 dark:text-gray-400">Our vision for the Base community.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { 
                        icon: Sparkles, 
                        title: 'Quality Over Numbers', 
                        desc: 'Everyone creates content, but not everyone gets seen. Here, numbers don\'t matter. Your quality and consistency define your rank, not your follower count.' 
                    },
                    { 
                        icon: Target, 
                        title: 'Get Recognized', 
                        desc: 'We do the work to get your content to the right eyes. Our main vision is connecting true builders with the recognition and funding they deserve.' 
                    },
                    { 
                        icon: Heart, 
                        title: 'For the Community', 
                        desc: '100% Non-profit. We built this platform simply because we love Base. No fees, no hidden agenda—just pure vibes and on-chain reputation.' 
                    }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group p-10 rounded-[2.5rem] bg-gray-50 dark:bg-[#111] border border-transparent dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:shadow-ios-hover dark:hover:shadow-none transition-all duration-300"
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-base-blue group-hover:scale-110 transition-transform duration-300">
                            <feature.icon size={30} />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed dark:text-gray-400 text-lg">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
