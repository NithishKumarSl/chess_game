"use client";

import React from 'react';
import { Play, Settings, Crown, Brain, Clock, ArrowLeft, Zap, Target, Flame } from 'lucide-react';
import type { PlayerColor, AIDifficulty } from '../types/chess';

interface GameSettingsProps {
  playerColor: PlayerColor;
  aiDifficulty: AIDifficulty;
  onColorChange: (color: PlayerColor) => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onStartGame: () => void;
  onBack: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  playerColor,
  aiDifficulty,
  onColorChange,
  onDifficultyChange,
  onStartGame,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 mb-8 group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Back to Home</span>
          </button>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-blue-400/30 shadow-2xl">
              <Settings className="w-10 h-10 text-blue-400 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-black text-white bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">Game Setup</h1>
          </div>
          <p className="text-xl text-slate-300 font-light">Configure your chess game settings for the ultimate experience</p>
        </div>

        {/* Enhanced Settings Container */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
          <div className="space-y-12">
            {/* Enhanced Player Color Selection */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
                  <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold text-white">Choose Your Color</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: 'white', label: 'White', icon: '♔', desc: 'Play as White', gradient: 'from-gray-100 to-white', border: 'border-gray-300/50' },
                  { value: 'black', label: 'Black', icon: '♚', desc: 'Play as Black', gradient: 'from-gray-800 to-black', border: 'border-gray-600/50' },
                  { value: 'random', label: 'Random', icon: '🎲', desc: 'Random Color', gradient: 'from-purple-500 to-indigo-600', border: 'border-purple-400/50' }
                ].map(color => (
                  <button
                    key={color.value}
                    onClick={() => onColorChange(color.value as PlayerColor)}
                    className={`group p-8 rounded-3xl text-center transition-all duration-500 transform hover:scale-105 ${
                      playerColor === color.value
                        ? `bg-gradient-to-br ${color.gradient} text-white shadow-2xl scale-105 border-2 ${color.border}`
                        : 'bg-gradient-to-br from-white/5 to-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{color.icon}</div>
                    <div className="font-bold text-xl mb-2">{color.label}</div>
                    <div className="text-sm opacity-80">{color.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced AI Difficulty Selection */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                  <Brain className="w-8 h-8 text-purple-400 drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold text-white">AI Difficulty</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    value: 'easy', 
                    label: 'Easy', 
                    desc: 'Perfect for beginners and casual players', 
                    color: 'from-emerald-500 to-teal-600',
                    border: 'border-emerald-400/50',
                    icon: '🌱',
                    bgGradient: 'from-emerald-500/20 to-teal-600/20'
                  },
                  { 
                    value: 'normal', 
                    label: 'Normal', 
                    desc: 'Balanced challenge for intermediate players', 
                    color: 'from-blue-500 to-indigo-600',
                    border: 'border-blue-400/50',
                    icon: '⚖️',
                    bgGradient: 'from-blue-500/20 to-indigo-600/20'
                  },
                  { 
                    value: 'hard', 
                    label: 'Hard', 
                    desc: 'Advanced AI opponent for experienced players', 
                    color: 'from-red-500 to-pink-600',
                    border: 'border-red-400/50',
                    icon: '🔥',
                    bgGradient: 'from-red-500/20 to-pink-600/20'
                  }
                ].map(difficulty => (
                  <button
                    key={difficulty.value}
                    onClick={() => onDifficultyChange(difficulty.value as AIDifficulty)}
                    className={`group w-full p-8 rounded-3xl text-left transition-all duration-500 transform hover:scale-105 ${
                      aiDifficulty === difficulty.value
                        ? `bg-gradient-to-r ${difficulty.color} text-white shadow-2xl scale-105 border-2 ${difficulty.border}`
                        : `bg-gradient-to-br ${difficulty.bgGradient} text-white hover:bg-white/20 border border-white/20 hover:border-blue-400/50`
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{difficulty.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-2xl mb-2">{difficulty.label}</div>
                        <div className="text-lg opacity-90">{difficulty.desc}</div>
                      </div>
                      {aiDifficulty === difficulty.value && (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Time Control */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl border border-cyan-400/30">
                  <Clock className="w-8 h-8 text-cyan-400 drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold text-white">Time Control</h2>
              </div>
              
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-5xl mb-4">⏱️</div>
                  <div className="text-white font-bold text-2xl mb-3">No Time Limit</div>
                  <div className="text-slate-300 text-lg">Take your time to think through each move and develop your strategy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Start Game Button */}
          <div className="mt-16 text-center">
            <button
              onClick={onStartGame}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-2xl px-16 py-6 rounded-3xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 border border-blue-400/30"
            >
              <Play className="w-8 h-8" />
              <span className="relative z-10">Start Game</span>
              
              {/* Enhanced button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 -z-20"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
