"use client";

import React, { useState, useEffect } from 'react';
import { Crown, Zap, Sparkles, ArrowRight, Brain, Trophy, Swords } from 'lucide-react';

interface IntroPageProps {
  onStartGame: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStartGame }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Dynamic Chess Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 50%),
            linear-gradient(45deg, rgba(255,255,255,0.01) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0,0,0,0.3) 25%, transparent 25%)
          `,
          backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px'
        }}></div>
      </div>

      {/* Floating Chess Pieces Battle Scene */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left Side - White Pieces */}
        <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2">
          <div className={`transition-all duration-2000 ${animationPhase === 0 ? 'translate-x-2 scale-110' : animationPhase === 1 ? 'translate-x-0' : '-translate-x-2 scale-95'}`}>
            {/* White King */}
            <div className="mb-4 md:mb-6 relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white to-gray-300 rounded-full shadow-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-gray-800" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* White Queen */}
            <div className="mb-4 md:mb-6 relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-100 to-gray-400 rounded-full shadow-lg flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
            </div>
            
            {/* White Rook */}
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-white to-gray-300 rounded-lg shadow-md flex items-center justify-center transform rotate-45 hover:rotate-0 transition-transform duration-500">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-800 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Black Pieces */}
        <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2">
          <div className={`transition-all duration-2000 ${animationPhase === 0 ? '-translate-x-2 scale-110' : animationPhase === 1 ? 'translate-x-0' : 'translate-x-2 scale-95'}`}>
            {/* Black King */}
            <div className="mb-4 md:mb-6 relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-800 to-black rounded-full shadow-xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500 border-2 border-gray-600">
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="absolute -top-1 -left-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Black Queen */}
            <div className="mb-4 md:mb-6 relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-700 to-black rounded-full shadow-lg flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500 border border-gray-500">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            
            {/* Black Rook */}
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg shadow-md flex items-center justify-center transform -rotate-45 hover:rotate-0 transition-transform duration-500 border border-gray-600">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Battle Effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`transition-all duration-1000 ${animationPhase === 1 ? 'scale-125 opacity-100' : 'scale-100 opacity-60'}`}>
            <div className="relative">
              <Swords className="w-8 h-8 md:w-12 md:h-12 text-white animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-lg animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Lightning Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-px h-16 md:h-24 bg-gradient-to-b from-white via-blue-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-px h-12 md:h-16 bg-gradient-to-t from-white via-purple-400 to-transparent opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 md:w-16 h-px bg-gradient-to-r from-white via-cyan-400 to-transparent opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className={`p-4 md:p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-full border-2 border-white/20 shadow-2xl transition-all duration-1000 ${animationPhase === 0 ? 'scale-110 border-yellow-400/50' : ''}`}>
                <Crown className="w-6 h-6 md:w-6 md:h-6 text-white drop-shadow-2xl" />
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-black/50 to-gray-900/80 backdrop-blur-2xl rounded-full border-2 border-gray-600/30 shadow-2xl">
                <Zap className="w-4 h-4 md:w-4 md:h-4 text-white animate-pulse" />
              </div>
              <div className={`p-4 md:p-6 bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-2xl rounded-full border-2 border-gray-700/30 shadow-2xl transition-all duration-1000 ${animationPhase === 2 ? 'scale-110 border-purple-400/50' : ''}`}>
                <Trophy className="w-6 h-6 md:w-6 md:h-6 text-white drop-shadow-2xl" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl leading-none">
              CHESS MASTER
            </h1>
            
            <p className="text-lg md:text-xl lg:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Enter the ultimate battlefield of minds where 
              <span className="text-white font-semibold"> strategy meets intelligence</span>
            </p>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="group relative bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-white to-gray-300 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Brain className="w-6 h-6 md:w-7 md:h-7 text-black" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">AI OPPONENT</h3>
                <p className="text-gray-400 text-sm md:text-base">Advanced artificial intelligence with multiple difficulty levels</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-black/30 to-gray-900/20 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-700/30 hover:border-gray-500/50 transition-all duration-700 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/0 via-gray-700/10 to-gray-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gray-800 to-black rounded-xl md:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg border border-gray-600">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-white rounded-sm"></div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">PREMIUM UI</h3>
                <p className="text-gray-400 text-sm md:text-base">Modern design with smooth animations and effects</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10 hover:border-white/30 transition-all duration-700 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-white to-gray-300 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-black rounded-sm"></div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">FULL FEATURES</h3>
                <p className="text-gray-400 text-sm md:text-base">Complete chess experience with move history and analysis</p>
              </div>
            </div>
          </div>

          {/* Epic Start Button */}
          <button
            onClick={onStartGame}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center gap-0 md:gap-2 bg-gradient-to-r from-white via-gray-200 to-white text-black font-black text-xl md:text-xl lg:text-2xl px-8 md:px-12 lg:px-16 py-4 md:py-6 lg:py-8 rounded-full hover:from-gray-100 hover:via-white hover:to-gray-100 transition-all duration-500 shadow-2xl hover:shadow-white/20 transform hover:scale-110 border-4 border-white/20 hover:border-white/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10 tracking-wider">BEGIN BATTLE</span>
            <ArrowRight className={`w-4 h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 transition-all duration-500 relative z-10 ${isHovered ? 'translate-x-2 md:translate-x-3 rotate-12' : ''}`} />
            
            {/* Enhanced Glow Effects */}
            <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500 scale-110"></div>
          </button>

          <p className="text-gray-500 text-sm md:text-base lg:text-lg mt-6 md:mt-8 font-light tracking-wide">
            &quot;Every master was once a beginner. Every pro was once an amateur.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;