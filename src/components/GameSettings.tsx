"use client";

import React, { useState } from 'react';
import { Play, Settings, Crown, Brain, Clock, ArrowLeft, Zap, Timer, Plus, Minus } from 'lucide-react';
import type { PlayerColor, AIDifficulty, TimeControl } from '../types/chess';

interface GameSettingsProps {
  playerColor?: PlayerColor;
  aiDifficulty?: AIDifficulty;
  timeControl?: TimeControl;
  onColorChange?: (color: PlayerColor) => void;
  onDifficultyChange?: (difficulty: AIDifficulty) => void;
  onTimeControlChange?: (timeControl: TimeControl) => void;
  onStartGame?: () => void;
  onBack?: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  playerColor = 'white',
  aiDifficulty = 'intermediate',
  timeControl = { type: 'unlimited' },
  onColorChange = () => {},
  onDifficultyChange = () => {},
  onTimeControlChange = () => {},
  onStartGame = () => {},
  onBack = () => {}
}) => {
  const [customTime, setCustomTime] = useState(10); // Default 10 minutes

  const handleTimeControlChange = (type: TimeControl['type'], customMinutes?: number) => {
    let newTimeControl: TimeControl;
    
    switch (type) {
      case 'blitz':
        newTimeControl = { type: 'blitz', initialTime: 5 * 60 * 1000, increment: 0 }; // 5 minutes
        break;
      case 'rapid':
        newTimeControl = { type: 'rapid', initialTime: 15 * 60 * 1000, increment: 0 }; // 15 minutes
        break;
      case 'classical':
        newTimeControl = { type: 'classical', initialTime: 30 * 60 * 1000, increment: 0 }; // 30 minutes
        break;
      case 'custom':
        newTimeControl = { 
          type: 'custom', 
          initialTime: customMinutes! * 60 * 1000, 
          increment: 0,
          customTime: customMinutes
        };
        break;
      default:
        newTimeControl = { type: 'unlimited' };
    }
    
    onTimeControlChange(newTimeControl);
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Chess pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(white 0deg 90deg, transparent 90deg 180deg, white 180deg 270deg, transparent 270deg 360deg)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated lightning effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-px h-32 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
        <div className="absolute top-20 right-1/3 w-px h-24 bg-gradient-to-b from-white/40 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/2 w-px h-28 bg-gradient-to-b from-white/50 to-transparent animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-px h-20 bg-gradient-to-b from-white/30 to-transparent animate-pulse delay-1500"></div>
        
        {/* Diagonal lightning */}
        <div className="absolute top-16 left-16 w-20 h-px bg-gradient-to-r from-white/40 to-transparent transform rotate-45 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-16 h-px bg-gradient-to-r from-white/30 to-transparent transform -rotate-45 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 mb-4 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Game Configuration</h1>
            <Zap className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">Configure your chess match settings</p>
        </div>

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Player Color Selection - Compact */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Your Color</h2>
            </div>
            
            <div className="space-y-2">
              {[
                { value: 'white', label: 'White', icon: '♔', desc: 'First move advantage' },
                { value: 'black', label: 'Black', icon: '♚', desc: 'Second move advantage' },
                { value: 'random', label: 'Random', icon: '🎲', desc: 'Random assignment' }
              ].map(color => (
                <button
                  key={color.value}
                  onClick={() => onColorChange(color.value as PlayerColor)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${
                    playerColor === color.value
                      ? 'bg-white text-black border-2 border-white'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="text-2xl">{color.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{color.label}</div>
                    <div className="text-xs opacity-70">{color.desc}</div>
                  </div>
                  {playerColor === color.value && (
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty Selection - Compact */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">AI Strength</h2>
            </div>
            
            {/* AI Engine Status */}
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-300 mb-2">AI Engines Status:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                  ✓ Custom Algorithm
                </span>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                  ✓ Gemini 2.5 Flash
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {[
                              { value: 'novice', label: 'Novice', icon: '🌱', desc: 'Learning level with triple AI' },
              { value: 'intermediate', label: 'Intermediate', icon: '⚖️', desc: 'Competitive play with advanced engines' },
              { value: 'master', label: 'Master', icon: '🔥', desc: 'Grandmaster level with all AI engines' }
              ].map(difficulty => (
                <button
                  key={difficulty.value}
                  onClick={() => onDifficultyChange(difficulty.value as AIDifficulty)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${
                    aiDifficulty === difficulty.value
                      ? 'bg-white text-black border-2 border-white'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="text-2xl">{difficulty.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{difficulty.label}</div>
                    <div className="text-xs opacity-70">{difficulty.desc}</div>
                  </div>
                  {aiDifficulty === difficulty.value && (
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Control - Enhanced */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Time Control</h2>
            </div>
            
            <div className="space-y-2">
              {[
                { type: 'unlimited', label: 'Unlimited', icon: '∞', desc: 'No time limit' },
                { type: 'blitz', label: 'Blitz', icon: '⚡', desc: '5 minutes' },
                { type: 'rapid', label: 'Rapid', icon: '🏃', desc: '15 minutes' },
                { type: 'classical', label: 'Classical', icon: '♟️', desc: '30 minutes' }
              ].map(time => (
                <button
                  key={time.type}
                  onClick={() => handleTimeControlChange(time.type as TimeControl['type'])}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${
                    timeControl.type === time.type
                      ? 'bg-white text-black border-2 border-white'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="text-2xl">{time.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{time.label}</div>
                    <div className="text-xs opacity-70">{time.desc}</div>
                  </div>
                  {timeControl.type === time.type && (
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time Control */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Custom Time</h2>
            </div>
            
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <button
                  onClick={() => setCustomTime(Math.max(1, customTime - 1))}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <div className="text-2xl font-bold text-white">{formatTime(customTime)}</div>
                <button
                  onClick={() => setCustomTime(Math.min(120, customTime + 1))}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <button
                onClick={() => handleTimeControlChange('custom', customTime)}
                className={`w-full p-3 rounded-lg transition-all duration-300 ${
                  timeControl.type === 'custom'
                    ? 'bg-white text-black border-2 border-white'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="font-medium text-sm">Set Custom Time</div>
                <div className="text-xs opacity-70">Apply {formatTime(customTime)}</div>
              </button>
            </div>
          </div>
        </div>

        {/* Game Summary & Start Button */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Game Summary */}
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">Playing as:</span>
                <span className="capitalize">{playerColor}</span>
              </div>
              <div className="hidden lg:block w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">AI Strength:</span>
                <span className="capitalize">{aiDifficulty}</span>
              </div>
              <div className="hidden lg:block w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">Time Control:</span>
                <span>
                  {timeControl.type === 'unlimited' ? 'Unlimited' :
                   timeControl.type === 'blitz' ? 'Blitz (5m)' :
                   timeControl.type === 'rapid' ? 'Rapid (15m)' :
                   timeControl.type === 'classical' ? 'Classical (30m)' :
                   `Custom (${formatTime(timeControl.customTime || 10)})`}
                </span>
              </div>
            </div>

            {/* Start Game Button */}
            <button
              onClick={onStartGame}
              className="group relative inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/20"
            >
              <Play className="w-5 h-5" />
              <span>Begin Match</span>
              
              {/* Lightning effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white via-gray-200 to-white rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
            </button>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
            <Zap className="w-3 h-3 animate-pulse" />
            <span>Ready to challenge the AI?</span>
            <Zap className="w-3 h-3 animate-pulse delay-500" />
          </div>
        </div>
      </div>

      {/* Corner lightning accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20"></div>
    </div>
  );
};

export default GameSettings;