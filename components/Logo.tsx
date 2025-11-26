import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative overflow-hidden bg-black flex items-center justify-center shadow-lg shadow-blue-900/20 ${className}`}>
        {/* Abstract Glitch Background */}
        <div className="absolute inset-0 bg-blue-900/20"></div>
        
        {/* Main Square Shape */}
        <div className="relative w-[65%] h-[65%] border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-blue-500/10 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
             {/* Glitch Lines */}
             <div className="absolute top-[20%] -left-[20%] w-[140%] h-[2px] bg-blue-300/50 shadow-[0_0_5px_rgba(147,197,253,0.8)] transform -rotate-12"></div>
             <div className="absolute bottom-[30%] -left-[20%] w-[140%] h-[1px] bg-cyan-300/50 transform rotate-6"></div>
             
             {/* Inner Gradient */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-blue-500/10"></div>
             
             {/* Corner Accents */}
             <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-400"></div>
             <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-blue-400"></div>
        </div>
        
        {/* Outer Glow/Noise */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] mix-blend-overlay"></div>
    </div>
  );
};

export default Logo;