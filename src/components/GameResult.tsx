"use client";

import React from 'react';
import { Crown, RefreshCw, Home, Trophy, Handshake, Zap, Target, Flame } from 'lucide-react';
import type { GameResult } from '../types/chess';

interface GameResultProps {
  result: GameResult;
  onNewGame: () => void;
  onContinue: () => void;
  onGoHome: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ result, onNewGame, onContinue, onGoHome }) => {
  const getResultIcon = () => {
    switch (result.type) {
      case 'checkmate':
        return <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-2xl" />;
      case 'stalemate':
      case 'insufficient':
      case 'repetition':
      case 'draw':
        return <Handshake className="w-20 h-20 text-blue-400 drop-shadow-2xl" />;
      default:
        return <Crown className="w-20 h-20 text-purple-400 drop-shadow-2xl" />;
    }
  };

  const getResultTitle = () => {
    switch (result.type) {
      case 'checkmate':
        return 'Checkmate!';
      case 'stalemate':
        return 'Stalemate!';
      case 'insufficient':
        return 'Draw by Insufficient Material';
      case 'repetition':
        return 'Draw by Repetition';
      case 'draw':
        return 'Draw!';
      default:
        return 'Game Over!';
    }
  };

  const getResultMessage = () => {
    switch (result.type) {
      case 'checkmate':
        return `${result.winner} wins by checkmate!`;
      case 'stalemate':
        return 'The game ended in stalemate';
      case 'insufficient':
        return 'Neither player has enough material to checkmate';
      case 'repetition':
        return 'The same position occurred three times';
      case 'draw':
        return 'The game ended in a draw';
      default:
        return 'The game has ended';
    }
  };

  const getResultGradient = () => {
    switch (result.type) {
      case 'checkmate':
        return 'from-yellow-400/20 to-orange-500/20';
      case 'stalemate':
      case 'insufficient':
      case 'repetition':
      case 'draw':
        return 'from-blue-400/20 to-cyan-500/20';
      default:
        return 'from-purple-400/20 to-pink-500/20';
    }
  };

  const getResultBorder = () => {
    switch (result.type) {
      case 'checkmate':
        return 'border-yellow-400/50';
      case 'stalemate':
      case 'insufficient':
      case 'repetition':
      case 'draw':
        return 'border-blue-400/50';
      default:
        return 'border-purple-400/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6">
      <div className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border ${getResultBorder()} max-w-2xl w-full text-center transform transition-all duration-500 scale-100`}>
        {/* Enhanced Result Icon */}
        <div className="mb-8 flex justify-center">
          <div className={`p-8 bg-gradient-to-br ${getResultGradient()} rounded-full border ${getResultBorder()} shadow-2xl`}>
            {getResultIcon()}
          </div>
        </div>
        
        {/* Enhanced Result Title */}
        <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
          {getResultTitle()}
        </h2>
        
        {/* Enhanced Result Message */}
        <p className="text-white/90 text-xl mb-12 leading-relaxed font-light">
          {getResultMessage()}
        </p>
        
        {/* Enhanced Action Buttons */}
        <div className="space-y-6">
          <button
            onClick={onNewGame}
            className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xl py-6 px-8 rounded-3xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 border border-blue-400/30 flex items-center justify-center gap-4"
          >
            <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">Play Again</span>
            
            {/* Enhanced button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 -z-20"></div>
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={onContinue}
              className="flex-1 group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white font-bold text-lg py-4 px-6 rounded-3xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-blue-400/50"
            >
              Continue
            </button>
            
            <button
              onClick={onGoHome}
              className="flex-1 group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white font-bold text-lg py-4 px-6 rounded-3xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-blue-400/50 flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
